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

<<<<<<< HEAD

// GET /api/tasks
app.get('/api/tasks', (req, res) => {
    dao.listTasks()
    .then(exams => res.json(exams))
    .catch(()=> res.status(500).end());
  });

app.get('/api/tasks/:id', (req, res) => {

        dao.getTaskById(  req.params.id  )
        .then(exam => res.json(exam))
        .catch(() => res.status(500).end());
    });
=======
// GET /api/exams
app.get("/api/tasks", (req, res) => {
  dao
    .listTasks()
    .then((exams) => res.json(exams))
    .catch(() => res.status(500).end());
});
>>>>>>> 1ff6d3734ae746a16f18ca3ec4f48134cc208e5f
