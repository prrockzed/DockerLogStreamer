const express = require("express");
const Log = require("../models/Log");

const router = express.Router();

router.post("/filter", async (req, res) => {
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
    console.error("Error in /filter:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
