const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const WebSocket = require("ws");
const { startDockerLogs, stopDockerLogs } = require("./services/dockerLogs");
const connectToDatabase = require("./config/db");
require("./utils/env");

const PORT = 8080;
const API_PORT = 8081;

const app = express();
const wss = new WebSocket.Server({ port: PORT });

connectToDatabase();

app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:3000" }));

// WebSocket connection handling
let clients = 0;

wss.on("connection", (ws) => {
  clients += 1;
  console.log("Client connected. Total clients:", clients);

  startDockerLogs(wss);

  ws.on("close", () => {
    clients -= 1;
    console.log("Client disconnected. Total clients:", clients);

    if (clients === 0) {
      stopDockerLogs();
    }
  });
});

// REST API routes
const searchRoutes = require("./routes/search");
const filterRoutes = require("./routes/filter");

app.use("/api", searchRoutes);
app.use("/api", filterRoutes);

app.listen(API_PORT, () => {
  console.log(`REST API server is running on http://localhost:${API_PORT}`);
});

console.log(`WebSocket server is running on ws://localhost:${PORT}`);
