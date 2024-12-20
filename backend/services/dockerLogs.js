const { spawn } = require("child_process");
const Log = require("../models/Log");
const WebSocket = require("ws");

let dockerLogs = null;

const startDockerLogs = (wss) => {
  if (!dockerLogs) {
    console.log("Starting Docker log stream...");
    dockerLogs = spawn("docker", ["logs", "-f", "log-container"]);

    dockerLogs.stdout.on("data", async (data) => {
      const log = {
        timestamp: new Date(),
        message: data.toString().trim(),
      };

      try {
        await Log.create(log);
      } catch (error) {
        console.error("Error saving log to MongoDB:", error);
      }

      // Stream log to WebSocket clients
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
};

const stopDockerLogs = () => {
  if (dockerLogs) {
    console.log("Stopping Docker log stream...");
    dockerLogs.kill();
    dockerLogs = null;
  }
};

module.exports = { startDockerLogs, stopDockerLogs };
