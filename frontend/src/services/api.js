// Fetch logs based on search query
export const searchLogs = async (query) => {
  // const response = await fetch("http://localhost:8080/api/search", {
  const response = await fetch("https://dockerlogstreamer.onrender.com/api/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }
  return response.json();
};

// Fetch logs filtered by timestamp
export const filterLogs = async (startTime, endTime) => {
  // const response = await fetch("http://localhost:8080/api/filter", {
  const response = await fetch("https://dockerlogstreamer.onrender.com/api/filter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ startTime, endTime }),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }
  return response.json();
};
