import React, { useState } from "react";
import moment from "moment";
import "../styles/Calendar.css";

const CalendarHeader = ({ currentDate, onMonthSelect, onYearSelect }) => {
  const [showMonths, setShowMonths] = useState(false);
  const [showYears, setShowYears] = useState(false);

  const months = moment.months();
  const years = Array.from({ length: 51 }, (_, i) => 2000 + i); // 2000–2050

  const handleMonthClick = () => {
    setShowMonths(!showMonths);
    setShowYears(false);
  };

  const handleYearClick = () => {
    setShowYears(!showYears);
    setShowMonths(false);
  };

  return (
    <div className="calendar-header">
      <div className="dropdown-wrapper">
        <div className="calendar-select" onClick={handleMonthClick}>
          {moment(currentDate).format("MMMM")} ▼
        </div>
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
      </div>

      <div className="dropdown-wrapper">
        <div className="calendar-select" onClick={handleYearClick}>
          {moment(currentDate).format("YYYY")} ▼
        </div>
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
    </div>
  );
};

export default CalendarHeader;
