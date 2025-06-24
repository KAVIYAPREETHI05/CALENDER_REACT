// src/pages/CalendarLayout.js
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import Sidebar from '../components/Sidebar';
import CalendarGrid from '../components/CalendarGrid';
import '../styles/Calendar.css';

const generateCalendar = (date) => {
  const startOfMonth = moment(date).startOf('month');
  const startDate = moment(startOfMonth).startOf('week');
  const endDate = moment(startOfMonth).endOf('month').endOf('week');

  const calendar = [];
  const current = moment(startDate);

  while (current.isSameOrBefore(endDate)) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      week.push(moment(current));
      current.add(1, 'day');
    }
    calendar.push(week);
  }

  return calendar;
};

const CalendarLayout = () => {
  const [currentDate, setCurrentDate] = useState(moment());
  const [selectedDate, setSelectedDate] = useState(moment());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const today = moment();

  const goToPreviousMonth = () => {
    setCurrentDate(prev => moment(prev).subtract(1, 'month'));
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => moment(prev).add(1, 'month'));
  };

  const handleMonthClick = () => {
    setShowMonthPicker(true);
    setShowYearPicker(false);
  };

  const handleYearClick = () => {
    setShowYearPicker(true);
    setShowMonthPicker(false);
  };

  const handleMonthSelect = (monthIndex) => {
    setCurrentDate(prev => moment(prev).month(monthIndex));
    setShowMonthPicker(false);
  };

  const handleYearSelect = (year) => {
    setCurrentDate(prev => moment(prev).year(year));
    setShowYearPicker(false);
  };

  const getEventsForDate = (date) => {
    if (date.date() % 7 === 0) {
      return [{ time: "10:00 AM", title: "Weekly Review" }];
    }
    return [];
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        goToPreviousMonth();
      } else if (e.key === 'ArrowRight') {
        goToNextMonth();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const calendar = generateCalendar(currentDate);

  const monthNames = moment.months();
  const yearsRange = Array.from({ length: 20 }, (_, i) => moment().year() - 10 + i);

  return (
    <div className="calendar-layout">
      <div className="sidebar-container">
        <Sidebar selectedDate={selectedDate} />
      </div>

      <div className="calendar-container">
        <div className="calendar-header">
          <h1 className="month-title">
            <span className="month-text" onClick={handleMonthClick}>
              {currentDate.format("MMMM")}
            </span>
            <span className="year-text" onClick={handleYearClick}>
              {currentDate.format("YYYY")}
            </span>
          </h1>
        </div>

        {/* Month Picker */}
        {showMonthPicker && (
          <div className="month-picker">
            {monthNames.map((month, index) => (
              <div
                key={month}
                className={`month-option ${index === currentDate.month() ? "active" : ""}`}
                onClick={() => handleMonthSelect(index)}
              >
                {month}
              </div>
            ))}
          </div>
        )}

        {/* Year Picker */}
        {showYearPicker && (
          <div className="year-picker">
            {yearsRange.map((year) => (
              <div
                key={year}
                className={`year-option ${year === currentDate.year() ? "active" : ""}`}
                onClick={() => handleYearSelect(year)}
              >
                {year}
              </div>
            ))}
          </div>
        )}

        <CalendarGrid
          calendar={calendar}
          today={today}
          currentDate={currentDate}
          onDateClick={setSelectedDate}
          getEventsForDate={getEventsForDate}
          goToPreviousMonth={goToPreviousMonth}
          goToNextMonth={goToNextMonth}
        />
      </div>
    </div>
  );
};

export default CalendarLayout;
