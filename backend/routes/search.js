const express = require("express");
const Log = require("../models/Log");

const router = express.Router();

router.post("/search", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "Query is required" });

    const results = await Log.find({
      message: { $regex: query, $options: "i" },
    });
    res.json(results);
  } catch (error) {
    console.error("Error in /search:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
