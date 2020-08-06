const express = require("express");
const fs = require("fs");
const { parse } = require("path");

const router = express.Router();
//====================== Get APIs ======================//
// Get all courses
router.get("/", (req, res) => {
  let coursesData = JSON.parse(fs.readFileSync("json_data/courses.json"));
  res.json({ data: coursesData.data, error: null });
});

// Get course w.r.t [id]
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

//====================== POST APIs ======================//
// Add course
router.post("/", (req, res) => {
  const name = req.body.name;
  const description = req.body.description;
  const availableSlots = req.body.availableSlots;
  if (!name || !availableSlots || !description) {
    return res.status(400).json({ error: "Invalid input data." });
  }
  fs.readFile("json_data/courses.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Can't read data" });
    }
    obj = JSON.parse(data);
    obj.data.push({
      id: obj.data.length > 0 ? obj.data[obj.data.length - 1].id + 1 : 1,
      name: name,
      description: description,
      enrolledStudents: [],
      availableSlots: availableSlots,
    });
    jsonData = JSON.stringify(obj, null, 2);
    fs.writeFile("json_data/courses.json", jsonData, "utf8", () => {
      res.json({ success: true });
    });
  });
});

// Enroll student in course.
router.post("/:id/enroll", (req, res) => {
  const courseId = req.params.id;
  const studentId = req.body.studentId;
  let courses = JSON.parse(fs.readFileSync("json_data/courses.json", "utf8"));
  let students = JSON.parse(fs.readFileSync("json_data/students.json", "utf8"));
  // Course and student validations.
  const course = courses.data.find((course) => {
    return course.id === parseInt(courseId);
  });
  const student = students.data.find((student) => {
    return student.id === parseInt(studentId);
  });
  if (!course) {
    return res
      .status(400)
      .json({ error: `No such course exist with id ${courseId}` });
  }
  if (!student) {
    return res
      .status(400)
      .json({ error: `No such student exist with id ${studentId}` });
  }
  // Available slots check.
  if (course.availableSlots < 1) {
    return res.json({ success: false, msg: "No empty slot found." });
  }
  // Add student to [enrolledStudents] list.
  courses.data[courseId - 1].enrolledStudents.push({
    id: student.id,
    name: student.name,
  });
  jsonData = JSON.stringify(courses, null, 2);
  fs.writeFile("json_data/courses.json", jsonData, "utf8", () => {
    res.json({ success: true });
  });
});

//====================== PUT APIs ======================//
router.put("/:id/deregister", (req, res) => {
  const courseId = req.params.id;
  const studentId = req.body.studentId;
  let courses = JSON.parse(fs.readFileSync("json_data/courses.json", "utf8"));
  // Course validation.
  const course = courses.data.find((course) => {
    return course.id === parseInt(courseId);
  });
  if (!course) {
    return res
      .status(400)
      .json({ error: `No such course exist with id ${courseId}` });
  }
  let enrolledStudents = courses.data[courseId - 1].enrolledStudents;
  // Enrolled student validation.
  const found = enrolledStudents.some((student) => {
    return student.id === parseInt(studentId);
  });
  if (!found) {
    return res.json({
      success: false,
      msg: `No such student with id ${studentId} enrolled.`,
    });
  }
  // Filterout the student from [enrolledStudents] list.
  let newEnrolledStudents = enrolledStudents.filter((student) => {
    return student.id !== parseInt(studentId);
  });
  courses.data[courseId - 1].enrolledStudents = newEnrolledStudents;
  jsonData = JSON.stringify(courses, null, 2);
  fs.writeFile("json_data/courses.json", jsonData, "utf8", () => {
    res.json({ success: true });
  });
});

module.exports = router;
