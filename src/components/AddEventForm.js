import React, { useState } from "react";
import "../styles/AddEventForm.css";

const generateTimeOptions = () => {
  const times = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hour = h.toString().padStart(2, "0");
      const minute = m.toString().padStart(2, "0");
      times.push(`${hour}:${minute}`);
    }
  }
  return times;
};

const AddEventForm = ({ selectedDate, onClose, onAdd }) => {
  const initialDate = selectedDate || new Date();

  const [formData, setFormData] = useState({
    title: "",
    day: initialDate.date?.() || new Date().getDate(),
    month: (initialDate.month?.() ?? new Date().getMonth()) + 1,
    year: initialDate.year?.() || new Date().getFullYear(),
    startTime: "",
    endTime: "",
    category: "official",
    priority: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "priority" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { day, month, year, ...rest } = formData;
    const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    onAdd({ ...rest, date });
    onClose();
  };

  const timeOptions = generateTimeOptions();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Add New Event</h3>
        <form onSubmit={handleSubmit}>
          <input name="title" style={{ width: "300px" }} placeholder="Title" required onChange={handleChange} />

          <div className="date-selectors">
            <select name="day" value={formData.day} onChange={handleChange}>
              {[...Array(31)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>

            <select name="month" value={formData.month} onChange={handleChange}>
              {[
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
              ].map((m, i) => (
                <option key={i + 1} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>

            <select name="year" value={formData.year} onChange={handleChange}>
              {[2024, 2025, 2026].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <label>Start Time:</label>
          <select name="startTime" value={formData.startTime} onChange={handleChange}>
            <option value="">--Select--</option>
            {timeOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>

          <label>End Time:</label>
          <select name="endTime" value={formData.endTime} onChange={handleChange}>
            <option value="">--Select--</option>
            {timeOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>

          <select name="category" onChange={handleChange}>
            <option value="official">Official</option>
            <option value="personal">Personal</option>
          </select>

          <select name="priority" onChange={handleChange}>
            <option value={1}>High</option>
            <option value={2}>Medium</option>
            <option value={3}>Low</option>
          </select>

          <div className="form-actions">
            <button type="submit">Add Event</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventForm;
