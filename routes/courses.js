const express = require("express");
const fs = require("fs");

const router = express.Router();

// Get APIs
router.get("/", (req, res) => {
  let coursesData = JSON.parse(fs.readFileSync("json_data/courses.json"));
  res.json({ data: coursesData.data, error: null });
});

router.get("/:id", (req, res) => {
  let coursesData = JSON.parse(fs.readFileSync("json_data/courses.json"));
  let course = coursesData.data.find((course) => {
    return course.id === parseInt(req.params.id);
  });
  if (!course) {
    return res.status(400).json({
      error: `No such course exist with id ${req.params.id}.`,
    });
  }
  res.json({ data: course, error: null });
});

module.exports = router;
