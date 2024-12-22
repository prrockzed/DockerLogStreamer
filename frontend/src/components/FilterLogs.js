import React, { useState } from "react";
import "../styles/FilterLogs.css";

const FilterLogs = ({ onFilter }) => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleFilter = () => {
    if (startTime && endTime) {
      onFilter(startTime, endTime);
    }
  };

  return (
    <div className="filter-container">
      <input
        className="datetime-input"
        type="datetime-local"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
      />
      <input
        className="datetime-input"
        type="datetime-local"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
      />
      <button className="filter-button" onClick={handleFilter}>
        Filter by Timestamp
      </button>
    </div>
  );
};

export default FilterLogs;
