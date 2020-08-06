const express = require("express");
const fs = require("fs");
const router = express.Router();

// Get APIs
router.get("/", (req, res) => {
  let studentsData = JSON.parse(fs.readFileSync("json_data/students.json"));
  res.json({ data: studentsData.data, error: null });
});

module.exports = router;
