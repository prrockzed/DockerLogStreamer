import React from "react";

const LiveLogs = ({ logs }) => {
  return (
    <div
      style={{
        height: "200px",
        overflowY: "scroll",
        border: "1px solid black",
      }}
    >
      {logs.map((log, index) => (
        <div key={index}>
          <strong>{log.timestamp}:</strong> {log.message}
        </div>
      ))}
    </div>
  );
};

export default LiveLogs;
