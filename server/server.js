const express = require("express");
const morgan = require("morgan"); // logging middleware
const { check, validationResult } = require("express-validator"); // validation middleware
const dao = require("./dao"); // module for accessing the DB

/*id,description,important, private, deadline, complete, user */

const PORT = 3001;

app = new express();

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}/`)
);

// set-up the middlewares
app.use(morgan("dev"));
app.use(express.json()); // for parsing json request body

// GET /api/exams
app.get("/api/tasks", (req, res) => {
  dao
    .listTasks()
    .then((exams) => res.json(exams))
    .catch(() => res.status(500).end());
});
