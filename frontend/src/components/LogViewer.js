import React, { useState, useEffect } from "react";
import LiveLogs from "./LiveLogs";
import SearchLogs from "./SearchLogs";
import FilterLogs from "./FilterLogs";
import { searchLogs, filterLogs } from "../services/api";
import "../styles/LogViewer.css";

const LogViewer = () => {
  const [liveLogs, setLiveLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  // WebSocket for live logs
  useEffect(() => {
    // const socket = new WebSocket("ws://localhost:8080");
    const socket = new WebSocket("wss://dockerlogstreamer.onrender.com");

    socket.onmessage = (event) => {
      const log = JSON.parse(event.data);
      setLiveLogs((prevLogs) => [...prevLogs.slice(-99), log]);
    };

    return () => socket.close();
  }, []);

  const handleSearch = async (query) => {
    const results = await searchLogs(query);
    setSearchResults(results);
  };

  const handleFilter = async (startTime, endTime) => {
    const results = await filterLogs(startTime, endTime);
    setFilteredLogs(results);
  };

  return (
    <div className="logviewer">
      <div className="handlesearch">
        <SearchLogs onSearch={handleSearch} />
      </div>
      <div className="handlefilter">
        <FilterLogs onFilter={handleFilter} />
      </div>
      <h2 className="livelogs">Live Logs</h2>
      <LiveLogs logs={liveLogs} />
      <h2 className="searchlogs">Search Results</h2>
      <LiveLogs logs={searchResults} />
      <h2 className="filterlogs">Filtered Logs</h2>
      <LiveLogs logs={filteredLogs} />
    </div>
  );
};

export default LogViewer;
