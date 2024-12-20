import React, { useState } from "react";

const FilterLogs = ({ onFilter }) => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleFilter = () => {
    if (startTime && endTime) {
      onFilter(startTime, endTime);
    }
  };

  return (
    <div>
      <input
        type="datetime-local"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
      />
      <input
        type="datetime-local"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
      />
      <button onClick={handleFilter}>Filter by Timestamp</button>
    </div>
  );
};

export default FilterLogs;
