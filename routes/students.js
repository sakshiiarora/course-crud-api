const express = require("express");
const fs = require("fs");
const router = express.Router();

//====================== Get APIs ======================//
router.get("/", (req, res) => {
  let studentsData = JSON.parse(fs.readFileSync("json_data/students.json"));
  res.json({ data: studentsData.data, error: null });
});

//====================== POST APIs ======================//
router.post("/", (req, res) => {
  const name = req.body.name;
  if (!name) {
    res.status(400).json({ error: "Invalid input." });
  }
  fs.readFile("json_data/students.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Couldn't read file." });
    }
    let obj = JSON.parse(data);
    obj.data.push({
      id: obj.data.length > 0 ? obj.data[obj.data.length - 1].id + 1 : 1,
      name: name,
    });
    let jsonData = JSON.stringify(obj, null, 2);
    fs.writeFile("json_data/students.json", jsonData, "utf8", () => {
      return res.json({ success: true });
    });
  });
});

module.exports = router;
