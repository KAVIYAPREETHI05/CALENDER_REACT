import dayjs from "dayjs";

// Convert "HH:mm" string to total minutes since midnight
const getTimeInMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

// Check if two events overlap
export const isConflict = (eventA, eventB) => {
  const startA = getTimeInMinutes(eventA.time);
  const endA = startA + eventA.duration;
  const startB = getTimeInMinutes(eventB.time);
  const endB = startB + eventB.duration;

  return startA < endB && startB < endA;
};

// Group events by date and mark conflicts
export const groupEventsByDate = (events) => {
  const grouped = {};

  events.forEach((event) => {
    const date = event.date;
    if (!grouped[date]) grouped[date] = [];

    // Conflict check
    const hasConflict = grouped[date].some((existing) =>
      isConflict(existing, event)
    );

    grouped[date].push({ ...event, conflict: hasConflict });
  });

  return grouped;
};
