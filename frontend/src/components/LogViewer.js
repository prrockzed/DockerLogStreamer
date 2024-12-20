import React, { useState, useEffect } from "react";
import LiveLogs from "./LiveLogs";

const LogViewer = () => {
  const [liveLogs, setLiveLogs] = useState([]);

  // WebSocket for live logs
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");

    socket.onmessage = (event) => {
      const log = JSON.parse(event.data);
      setLiveLogs((prevLogs) => [...prevLogs.slice(-99), log]);
    };

    return () => socket.close();
  }, []);

  return (
    <div>
      <h2>Live Logs</h2>
      <LiveLogs logs={liveLogs} />
    </div>
  );
};

export default LogViewer;
