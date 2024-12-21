import React from "react";

const LiveLogs = ({ logs }) => {
  // Ensure only the last 20 logs are displayed
  const visibleLogs = logs.slice(-20);

  return (
    <div
      style={{
        height: "200px",
        overflowY: "scroll",
        border: "1px solid black",
      }}
    >
      {visibleLogs.map((log, index) => (
        <div key={index}>
          <strong>{log.timestamp}:</strong> {log.message}
        </div>
      ))}
    </div>
  );
};

export default LiveLogs;
