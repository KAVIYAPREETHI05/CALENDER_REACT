import React, { useState, useEffect } from "react";
import moment from "moment";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import eventData from "../data/events.json";
import "../styles/Calendar.css";
import AddEventForm from "./AddEventForm";

// 🔁 Conflict resolver
function resolveConflicts(events) {
  const grouped = {};
  events.forEach(e => {
    grouped[e.date] = [...(grouped[e.date] || []), e];
  });

  const result = [];
  const conflictedMap = {};

  for (let date in grouped) {
    const daily = grouped[date]
      .map(e => ({
        ...e,
        start: moment(`${e.date} ${e.startTime || e.time}`, "YYYY-MM-DD HH:mm"),
        end: moment(`${e.date} ${e.endTime || e.time}`, "YYYY-MM-DD HH:mm").add(e.duration || 60, 'minutes')
      }))
      .sort((a, b) => a.start - b.start || b.priority - a.priority);

    const schedule = [];

    daily.forEach(event => {
      const conflict = schedule.find(e => event.start.isBefore(e.end) && event.end.isAfter(e.start));

      if (!conflict) {
        schedule.push(event);
        result.push({ ...event, conflict: false });
      } else {
        const newStart = moment(conflict.end);
        const newEnd = moment(newStart).add(event.end.diff(event.start));
        schedule.push({ start: newStart, end: newEnd });

        result.push({
          ...event,
          startTime: event.start.format("HH:mm"),
          endTime: event.end.format("HH:mm"),
          conflict: true,
          rescheduled: false,
        });

        result.push({
          ...event,
          startTime: newStart.format("HH:mm"),
          endTime: newEnd.format("HH:mm"),
          conflict: true,
          rescheduled: true,
        });

        conflictedMap[event.date] = true;
      }
    });
  }

  return { resolved: result, conflictDates: Object.keys(conflictedMap) };
}

const Calendar = () => {
  const today = moment();
  const [currentDate, setCurrentDate] = useState(today.clone());
  const [calendar, setCalendar] = useState([]);
  const [selectedDate, setSelectedDate] = useState(today);
  const [isDateSelected, setIsDateSelected] = useState(false);
  const [processedEvents, setProcessedEvents] = useState([]);
  const [eventDates, setEventDates] = useState([]);
  const [conflictDates, setConflictDates] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [userEvents, setUserEvents] = useState([]);

  // 🧠 Load user-added events from localStorage
  useEffect(() => {
    const storedUserEvents = localStorage.getItem("userEvents");
    if (storedUserEvents) {
      setUserEvents(JSON.parse(storedUserEvents));
    }
  }, []);

  // 🔁 Combine base events + user events and resolve
  useEffect(() => {
    const startDay = currentDate.clone().startOf("month").startOf("week");
    const endDay = currentDate.clone().endOf("month").endOf("week");
    const day = startDay.clone().subtract(1, "day");
    const a = [];

    while (day.isBefore(endDay, "day")) {
      a.push(
        Array(7)
          .fill(0)
          .map(() => day.add(1, "day").clone())
      );
    }

    const combinedEvents = [...eventData, ...userEvents];
    const { resolved, conflictDates } = resolveConflicts(combinedEvents);

    setCalendar(a);
    setProcessedEvents(resolved);
    setConflictDates(conflictDates);
    setEventDates([...new Set(resolved.map(e => e.date))]);
  }, [currentDate, userEvents]);

  useEffect(() => {
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }

  const now = moment();

  processedEvents.forEach((event) => {
    const eventStart = moment(`${event.date} ${event.startTime}`, "YYYY-MM-DD HH:mm");

    const diffToStart = eventStart.diff(now);
    const diffTo30MinBefore = eventStart.clone().subtract(30, "minutes").diff(now);

    if (diffTo30MinBefore > 0) {
      setTimeout(() => {
        new Notification(`Upcoming Event: ${event.title}`, {
          body: `Starts in 30 minutes at ${event.startTime}`,
        });
      }, diffTo30MinBefore);
    }

    if (diffToStart > 0) {
      setTimeout(() => {
        new Notification(`Event Starting Now: ${event.title}`, {
          body: `Happening now at ${event.startTime}`,
        });
      }, diffToStart);
    }
  });
}, [processedEvents]);


  // 💾 Save userEvents to localStorage on change
  useEffect(() => {
    localStorage.setItem("userEvents", JSON.stringify(userEvents));
  }, [userEvents]);

  const prevMonth = () => {
    setCurrentDate(currentDate.clone().subtract(1, "month"));
    setIsDateSelected(false);
  };

  const nextMonth = () => {
    setCurrentDate(currentDate.clone().add(1, "month"));
    setIsDateSelected(false);
  };

  const getEventsForDate = (date) => {
    return processedEvents.filter(event => event.date === date.format("YYYY-MM-DD"));
  };

  const getEventsForMonth = () => {
    return processedEvents.filter(event =>
      moment(event.date).isSame(currentDate, "month")
    );
  };

  const handleAddEvent = (newEvent) => {
    setUserEvents((prev) => [...prev, newEvent]); // triggers reprocessing + localStorage sync
    setShowForm(false);
  };
  const handleNotificationPermission = () => {
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  } else if (Notification.permission === "granted") {
    alert("Notifications are already enabled.");
  } else if (Notification.permission === "denied") {
    alert(
      "Notifications are blocked. Please enable them manually in browser settings."
    );
  } else {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        alert("Notifications enabled!");
      } else {
        alert("Notifications not allowed.");
      }
    });
  }
};


  return (
    <div className="calendar-container">
      <div className="calendar-left-panel">
       <div className="calendar-header-buttons">
  <button className="add-event-button" onClick={() => setShowForm(true)}>
    ➕ Add Event
  </button>
  <button className="notify-button" onClick={handleNotificationPermission}>
    🔔 Enable Notifications
  </button>
</div>

        {showForm && (
          <AddEventForm
            selectedDate={selectedDate}
            onClose={() => setShowForm(false)}
            onAdd={handleAddEvent}
          />
        )}

        <h2>
          {isDateSelected
            ? selectedDate.format("D MMM YYYY")
            : currentDate.format("MMMM YYYY")}
        </h2>

        <p>
          {isDateSelected
            ? getEventsForDate(selectedDate).length
              ? "Events on this day:"
              : "No Events Today"
            : getEventsForMonth().length
              ? "Events this month:"
              : "No Events This Month"}
        </p>

        <div className="task-list">
          {(isDateSelected ? getEventsForDate(selectedDate) : getEventsForMonth()).map(
            (event, idx) => (
              <div key={idx} className={`task-item ${event.conflict ? "conflict" : ""}`}>
                {!isDateSelected && (
                  <div className="event-date">
                    📅 {moment(event.date).format("D MMM YYYY")}
                  </div>
                )}
                <span className="time">
                  🕒 {event.startTime} - {event.endTime}
                </span>{" "}
                {event.title}
                {event.rescheduled && (
                  <span className="resched-label"> (Rescheduled)</span>
                )}
              </div>
            )
          )}
        </div>
      </div>

      <div className="calendar-right-panel">
        <CalendarHeader
          currentDate={selectedDate}
          onMonthSelect={(monthIndex) => {
            const updated = selectedDate.clone().month(monthIndex);
            setSelectedDate(updated);
            setCurrentDate(updated);
            setIsDateSelected(false);
          }}
          onYearSelect={(year) => {
            const updated = selectedDate.clone().year(year);
            setSelectedDate(updated);
            setCurrentDate(updated);
            setIsDateSelected(false);
          }}
        />

        <CalendarGrid
          currentDate={currentDate}
          calendar={calendar}
          today={today}
          onDateClick={(date) => {
            setSelectedDate(date);
            setIsDateSelected(true);
          }}
          getEventsForDate={getEventsForDate}
          eventDates={eventDates}
          conflictDates={conflictDates}
        />

        <div className="calendar-nav-buttons">
          <button onClick={prevMonth}>◀</button>
          <button onClick={nextMonth}>▶</button>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
