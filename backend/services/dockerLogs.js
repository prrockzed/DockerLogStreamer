// const { spawn } = require("child_process");
// const Log = require("../models/Log");
// const WebSocket = require("ws");

// let dockerLogs = null;

// const startDockerLogs = (wss) => {
//   if (!dockerLogs) {
//     console.log("Starting Docker log stream...");
//     dockerLogs = spawn("docker", ["logs", "-f", "log-container"]);

//     dockerLogs.stdout.on("data", async (data) => {
//       const log = {
//         timestamp: new Date(),
//         message: data.toString().trim(),
//       };

//       try {
//         await Log.create(log);
//       } catch (error) {
//         console.error("Error saving log to MongoDB:", error);
//       }

//       // Stream log to WebSocket clients
//       wss.clients.forEach((client) => {
//         if (client.readyState === WebSocket.OPEN) {
//           client.send(JSON.stringify(log));
//         }
//       });
//     });

//     dockerLogs.stderr.on("data", (data) => {
//       console.error(`Docker error: ${data}`);
//     });
//   }
// };

// const stopDockerLogs = () => {
//   if (dockerLogs) {
//     console.log("Stopping Docker log stream...");
//     dockerLogs.kill();
//     dockerLogs = null;
//   }
// };

// module.exports = { startDockerLogs, stopDockerLogs };

const axios = require("axios");
const Log = require("../models/Log");
const WebSocket = require("ws");

let logInterval = null;

const startDockerLogs = (wss) => {
  if (!logInterval) {
    console.log("Starting remote Docker log stream...");

    // Use setInterval to poll logs from the Render container
    logInterval = setInterval(async () => {
      try {
        const response = await axios.get(
          "https://dockerlogger.onrender.com/logs"
        );
        const logs = response.data; // Assuming the response is an array of log messages

        logs.forEach(async (logMessage) => {
          const log = {
            timestamp: new Date(),
            message: logMessage,
          };

          // Save log to MongoDB
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
      } catch (error) {
        console.error("Error fetching logs from remote container:", error);
      }
    }, 1000); // Poll every 1 second
  }
};

const stopDockerLogs = () => {
  if (logInterval) {
    console.log("Stopping remote Docker log stream...");
    clearInterval(logInterval);
    logInterval = null;
  }
};

module.exports = { startDockerLogs, stopDockerLogs };
