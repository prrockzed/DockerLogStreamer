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
const MAX_LOG_COUNT = 1000; // Maximum number of logs to keep in memory

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

app.listen(API_PORT, () => {
  console.log(`REST API server is running on http://localhost:${API_PORT}`);
});

console.log(`WebSocket server is running on ws://localhost:${PORT}`);
