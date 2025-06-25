import React, { useState } from "react";
import "../styles/Calendar.css";

const CalendarGrid = ({
  calendar,
  today,
  currentDate,
  onDateClick,
  getEventsForDate,
  eventDates = [],
  conflictDates = [],
}) => {
  const [hoveredDate, setHoveredDate] = useState(null);

  return (
    <div className="calendar-grid">
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
        <div key={d} className="calendar-day calendar-header-day">
          {d}
        </div>
      ))}

      {calendar.map((week, wi) =>
        week.map((day, di) => {
          const isToday = day.isSame(today, "day");
          const isCurrentMonth = day.isSame(currentDate, "month");
          const events = getEventsForDate(day);
          const dateStr = day.format("YYYY-MM-DD");
          const hasEvent = eventDates.includes(dateStr);
          const hasConflict = conflictDates.includes(dateStr);

          return (
            <div
              key={`${wi}-${di}`}
              className={`calendar-day 
                ${isToday ? "today" : ""} 
                ${!isCurrentMonth ? "other-month" : ""} 
                ${hasEvent ? "has-event" : ""} 
                ${hasConflict ? "has-conflict" : ""}
              `}
              onClick={() => onDateClick(day)}
              onMouseEnter={() => setHoveredDate(day)}
              onMouseLeave={() => setHoveredDate(null)}
            >
              {day.date()}

              {hoveredDate?.isSame(day, "day") && events.length > 0 && (
                <div className="event-hover-popup">
                  {events.map((e, idx) => (
                    <div key={idx} className="event-hover-item">
                      {e.startTime || e.time} – {e.title}
                      {e.rescheduled && <span className="resched-label"> (Rescheduled)</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default CalendarGrid;
