# Docker Logs Streamer

This project is a web application for real-time streaming, searching, and filtering of logs from a live Docker container. The application streams live logs from a container, stores them in MongoDB Atlas, and provides a user-friendly interface to search and filter logs by timestamp.

## Features

- **Real-time Log Streaming**: Continuously streams logs from a Docker container and displays them on the frontend.
- **Search Logs**: Allows users to search logs using a specific keyword or phrase.
- **Filter by Timestamp**: Enables users to filter logs based on a date and time range.
- **MongoDB Atlas Integration**: Stores streamed logs in MongoDB for persistent storage and querying.

## Technologies Used

### Frontend
- React.js
  - Components:
    - `LiveLogs`: Displays live logs and results.
    - `SearchLogs`: Provides a search bar to query logs.
    - `FilterLogs`: Allows filtering of logs by timestamp.
- WebSocket for real-time log streaming.
- REST API for search and filter functionalities.

### Backend
- Node.js with Express.js
- WebSocket for live log streaming.
- MongoDB Atlas for log storage.
- Mongoose for MongoDB interaction.

## Folder Structure

### Frontend
```
/src
|-- components
|   |-- LogViewer.js       # Main component combining live logs, search, and filter
|   |-- LiveLogs.js        # Displays log entries
|   |-- SearchLogs.js      # Handles search functionality
|   |-- FilterLogs.js      # Handles filter functionality
|-- services
|   |-- api.js             # API calls for search and filter
|-- App.js                 # Main application entry
```

### Backend
```
/backend
│-- config
│   │-- db.js                # MongoDB connection setup
│
│-- models
│   │-- Log.js               # Mongoose schema and model for logs
│
│-- routes
│   │-- search.js            # Search logs API route
│   │-- filter.js            # Filter logs API route
│
│-- services
│   │-- dockerLogs.js        # Docker log streaming logic
│
│-- utils
│   │-- env.js               # Utility to load environment variables
│
│-- .env                     # Environment variables file (MongoDB URI, etc.)
│-- .gitignore               # Git ignore file to exclude sensitive files
│-- index.js                 # Main application entry point
│-- package.json             # Node.js project metadata and dependencies
│-- package-lock.json        # Dependency lockfile

```

## Setup Instructions

### Prerequisites
- Docker installed and running.
- Node.js and npm installed.
- MongoDB Atlas account with a connection string.
- A Docker container to stream logs from (example: an nginx container).

### Backend Setup
1. Clone this repository:
   ```bash
   git clone <repository_url>
   cd <repository_folder>/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure MongoDB:
   - Replace `your_mongodb_atlas_connection_string` in `index.js` with your MongoDB Atlas connection string.

4. Start the backend:
   ```bash
   node index.js
   ```

### Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd <repository_folder>/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

### Running the Application
1. Ensure your Docker container is running. Replace `log-container` in the backend with your container name.
   ```bash
   docker run --name log-container -d <image_name>
   ```
2. Start the backend and frontend servers as described above.
3. Use the application to view live logs, search logs, and filter logs by timestamp.


## Contribution
Feel free to contribute by submitting issues or pull requests. Follow the [GitHub Flow](https://guides.github.com/introduction/flow/) for contributions.

## License
This project is licensed under the MIT License.

---

Happy Logging!

