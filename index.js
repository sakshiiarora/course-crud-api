const express = require("express");
const fs = require("fs");

const app = new express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Courses API routes
app.use("/api/courses", require("./routes/courses"));

// Students API routes
app.use("/api/students", require("./routes/students"));

// Listen on [PORT]
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server is up and running..."));
