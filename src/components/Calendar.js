// Updated Calendar.jsx (main component)
import React, { useState, useEffect } from "react";
import moment from "moment";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import eventData from "../data/events.json";
import "../styles/Calendar.css";

const Calendar = () => {
  const today = moment();
  const [currentDate, setCurrentDate] = useState(today.clone());
  const [calendar, setCalendar] = useState([]);
  const [selectedDate, setSelectedDate] = useState(today);
  const [events, setEvents] = useState([]);

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
    setCalendar(a);
    setEvents(eventData);
  }, [currentDate]);

  const prevMonth = () => setCurrentDate(currentDate.clone().subtract(1, "month"));
  const nextMonth = () => setCurrentDate(currentDate.clone().add(1, "month"));

  const handleMonthClick = () => alert("Month dropdown coming soon!");
  const handleYearClick = () => alert("Year picker coming soon!");

  const getEventsForDate = (date) => {
    return events.filter(event => event.date === date.format("YYYY-MM-DD"));
  };

  return (
    <div className="calendar-container">
      {/* Sidebar */}
      <div className="calendar-left-panel">
        <h2>{selectedDate.format("D MMM YYYY")}</h2>
        <p>{getEventsForDate(selectedDate).length ? "Events on this day:" : "No Events Today"}</p>
        <div className="task-list">
          {getEventsForDate(selectedDate).map((event, idx) => (
            <div key={idx} className="task-item">
              <span className="time">{event.time}</span> {event.title}
            </div>
          ))}
        </div>
      </div>

      {/* Main Calendar Panel */}
      <div className="calendar-right-panel">
        <CalendarHeader
  currentDate={selectedDate}
  onMonthSelect={(monthIndex) => {
    const updated = selectedDate.clone().month(monthIndex);
    setSelectedDate(updated);
    setCurrentDate(updated); // also update view month
  }}
  onYearSelect={(year) => {
    const updated = selectedDate.clone().year(year);
    setSelectedDate(updated);
    setCurrentDate(updated); // also update view year
  }}
/>

       
        <CalendarGrid
          currentDate={currentDate}
          calendar={calendar}
          today={today}
          onDateClick={setSelectedDate}
          getEventsForDate={getEventsForDate}
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
