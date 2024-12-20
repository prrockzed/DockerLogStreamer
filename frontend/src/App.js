// src/App.js
import React from "react";
import Navbar from "./components/Navbar";
import LogViewer from "./components/LogViewer";

const App = () => {
  return (
    <div>
      <Navbar/>
      <LogViewer />
    </div>
  );
};

export default App;
