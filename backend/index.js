const WebSocket = require("ws");
const { spawn } = require("child_process");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const PORT = 8080;
const wss = new WebSocket.Server({ port: PORT });
const app = express();
const API_PORT = 8081; // Port for the REST API

app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:3000" }));

// In-memory storage for logs
let logs = [];
const MAX_LOG_COUNT = 1000

// Start WebSocket server for live streaming
let dockerLogs = null; // Keep track of the Docker log process
let clients = 0; // Track number of connected clients

wss.on("connection", (ws) => {
  clients += 1;
  console.log("Client connected. Total clients:", clients);

  if (!dockerLogs) {
    console.log("Starting Docker log stream...");
    dockerLogs = spawn("docker", ["logs", "-f", "log-container"]);

    dockerLogs.stdout.on("data", (data) => {
      const log = {
        timestamp: new Date().toISOString(),
        message: data.toString().trim(),
      };

      logs.push(log);
      if (logs.length > MAX_LOG_COUNT) logs.shift();

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(log));
        }
      });
    });

    dockerLogs.stderr.on("data", (data) => {
      console.error(`Docker error: ${data}`);
    });
  }

  ws.on("close", () => {
    clients -= 1;
    console.log("Client disconnected. Total clients:", clients);

    if (clients === 0 && dockerLogs) {
      console.log("No clients connected. Stopping Docker log stream...");
      dockerLogs.kill();
      dockerLogs = null;
    }
  });
});

app.post("/api/search", (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "Query is required" });
    const results = logs.filter((log) => log.message.includes(query));
    res.json(results);
  } catch (error) {
    console.error("Error in /api/search:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/filter", (req, res) => {
  try {
    const { startTime, endTime } = req.body;
    if (!startTime || !endTime) {
      return res
        .status(400)
        .json({ error: "Both startTime and endTime are required" });
    }

    const results = logs.filter(
      (log) =>
        new Date(log.timestamp) >= new Date(startTime) &&
        new Date(log.timestamp) <= new Date(endTime)
    );
    res.json(results);
  } catch (error) {
    console.error("Error in /api/filter:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(API_PORT, () => {
  console.log(`REST API server is running on http://localhost:${API_PORT}`);
});

console.log(`WebSocket server is running on ws://localhost:${PORT}`);
