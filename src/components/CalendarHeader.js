// CalendarHeader.jsx
import React, { useState } from "react";
import moment from "moment";
import "../styles/Calendar.css";

const CalendarHeader = ({ currentDate, onMonthSelect, onYearSelect }) => {
  const [showMonths, setShowMonths] = useState(false);
  const [showYears, setShowYears] = useState(false);

  const months = moment.months();
  const years = Array.from({ length: 21 }, (_, i) => moment().year() - 10 + i);

  return (
    <div className="calendar-header">
      <h1 className="month-title">
        <span className="day-text">{currentDate.format("dddd")}, </span>

        <span
          className="month-text hover-scale"
          onClick={() => setShowMonths(!showMonths)}
        >
          {currentDate.format("MMMM")}
        </span>

        <span
          className="year-text hover-scale"
          onClick={() => setShowYears(!showYears)}
        >
          {currentDate.format("YYYY")}
        </span>
      </h1>

      {showMonths && (
        <div className="month-dropdown">
          {months.map((month, index) => (
            <div
              key={month}
              className="dropdown-item"
              onClick={() => {
                setShowMonths(false);
                onMonthSelect(index);
              }}
            >
              {month}
            </div>
          ))}
        </div>
      )}

      {showYears && (
        <div className="year-dropdown">
          {years.map((year) => (
            <div
              key={year}
              className="dropdown-item"
              onClick={() => {
                setShowYears(false);
                onYearSelect(year);
              }}
            >
              {year}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CalendarHeader;
