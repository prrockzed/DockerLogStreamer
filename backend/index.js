require("dotenv").config();

const WebSocket = require("ws");
const { spawn } = require("child_process");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const PORT = 8080;
const API_PORT = 8081; // Port for the REST API

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define Mongoose schema and model for logs
const logSchema = new mongoose.Schema({
  timestamp: { type: Date, required: true },
  message: { type: String, required: true },
});
const Log = mongoose.model("Log", logSchema);

const app = express();
const wss = new WebSocket.Server({ port: PORT });

app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:3000" }));

// Start WebSocket server for live streaming
let dockerLogs = null; // Keep track of the Docker log process
let clients = 0; // Track number of connected clients

wss.on("connection", (ws) => {
  clients += 1;
  console.log("Client connected. Total clients:", clients);

  if (!dockerLogs) {
    console.log("Starting Docker log stream...");
    dockerLogs = spawn("docker", ["logs", "-f", "log-container"]); // Replace with your container name

    dockerLogs.stdout.on("data", async (data) => {
      const log = {
        timestamp: new Date(),
        message: data.toString().trim(),
      };

      // Save log to MongoDB
      try {
        await Log.create(log);
      } catch (error) {
        console.error("Error saving log to MongoDB:", error);
      }

      // Stream log to connected WebSocket clients
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

// REST API for searching logs
app.post("/api/search", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "Query is required" });

    const results = await Log.find({
      message: { $regex: query, $options: "i" },
    });
    res.json(results);
  } catch (error) {
    console.error("Error in /api/search:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// REST API for filtering logs by timestamp
app.post("/api/filter", async (req, res) => {
  try {
    const { startTime, endTime } = req.body;
    if (!startTime || !endTime) {
      return res
        .status(400)
        .json({ error: "Both startTime and endTime are required" });
    }

    const results = await Log.find({
      timestamp: { $gte: new Date(startTime), $lte: new Date(endTime) },
    });
    res.json(results);
  } catch (error) {
    console.error("Error in /api/filter:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the REST API server
app.listen(API_PORT, () => {
  console.log(`REST API server is running on http://localhost:${API_PORT}`);
});

console.log(`WebSocket server is running on ws://localhost:${PORT}`);
