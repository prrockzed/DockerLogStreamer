const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const WebSocket = require("ws");
const http = require("http"); // Import http module
// const { startDockerLogs, stopDockerLogs } = require("./services/dockerLogs");
const connectToDatabase = require("./config/db");
require("./utils/env");

// Ports
const PORT = process.env.PORT || 8080; // Single port for both WebSocket and REST API

// Initialize app and server
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server }); // Attach WebSocket to the same server

// Connect to MongoDB
connectToDatabase();

// Middleware
app.use(bodyParser.json());
app.use(
  cors({
    origin: "https://docker-log-streamer.vercel.app", // Frontend domain
    methods: ["GET", "POST"], // Allowing specific HTTP methods
  })
);

// app.use(cors({ origin: process.env.CLIENT_URL }));
// app.use(cors({ origin: "http://localhost:3000" }));

// WebSocket connection handling
let clients = 0;

wss.on("connection", (ws) => {
  clients += 1;
  console.log("Client connected. Total clients:", clients);

  // startDockerLogs(wss);

  ws.on("close", () => {
    clients -= 1;
    console.log("Client disconnected. Total clients:", clients);

    if (clients === 0) {
      // stopDockerLogs();
    }
  });
});

// REST API routes
const searchRoutes = require("./routes/search");
const filterRoutes = require("./routes/filter");

app.use("/api", searchRoutes);
app.use("/api", filterRoutes);

// Start the combined server
server.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
