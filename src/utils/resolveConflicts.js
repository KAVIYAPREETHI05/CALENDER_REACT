import moment from "moment";

// Priority map for categories
const categoryPriority = {
  official: 2,
  personal: 1
};

export default function resolveConflicts(events) {
  const grouped = {};
  events.forEach(e => (grouped[e.date] = [...(grouped[e.date] || []), e]));

  const result = [];

  for (let date in grouped) {
    const daily = grouped[date]
      .map(e => ({
        ...e,
        start: moment(`${e.date} ${e.startTime}`, "YYYY-MM-DD HH:mm"),
        end: moment(`${e.date} ${e.endTime}`, "YYYY-MM-DD HH:mm"),
        priority: categoryPriority[e.category?.toLowerCase()] || 0
      }))
      .sort((a, b) => a.start - b.start || b.priority - a.priority); // Prioritize earlier time, then category

    const schedule = [];

    daily.forEach(event => {
      const slot = schedule.find(
        e => event.start.isBefore(e.end) && event.end.isAfter(e.start)
      );

      if (!slot) {
        schedule.push(event);
        result.push({ ...event, conflict: false });
      } else {
        if (event.priority > slot.priority) {
          // Shift the existing lower-priority event
          const existingIdx = result.findIndex(
            r =>
              r.date === date &&
              r.start.isSame(slot.start) &&
              r.end.isSame(slot.end)
          );

          if (existingIdx !== -1) {
            const lowerEvent = result[existingIdx];
            const newStart = moment(event.end);
            const newEnd = moment(newStart).add(slot.end.diff(slot.start));

            result[existingIdx] = {
              ...lowerEvent,
              originalStart: lowerEvent.startTime,
              startTime: newStart.format("HH:mm"),
              endTime: newEnd.format("HH:mm"),
              conflict: true,
              rescheduled: true,
              start: newStart,
              end: newEnd
            };
          }

          schedule.push(event);
          result.push({ ...event, conflict: false });
        } else {
          // Reschedule current event
          const newStart = moment(slot.end);
          const newEnd = moment(newStart).add(event.end.diff(event.start));
          schedule.push({ start: newStart, end: newEnd, priority: event.priority });

          result.push({
            ...event,
            originalStart: event.start.format("HH:mm"),
            startTime: newStart.format("HH:mm"),
            endTime: newEnd.format("HH:mm"),
            conflict: true,
            rescheduled: true,
            start: newStart,
            end: newEnd
          });
        }
      }
    });
  }

  return result;
}
