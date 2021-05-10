const express = require("express");
const morgan = require("morgan"); // logging middleware
const { check, query, validationResult } = require("express-validator"); // validation middleware
const dao = require("./dao"); // module for accessing the DB
const dayjs = require("dayjs");

/*id,description,important, private, deadline, complete, user */
function filterToParameters(filterName, startDate, endDate) {
  let defaultDict = {
    important: undefined,
    private: undefined,
    startDeadline: undefined,
    endDeadline: undefined,
  };
  switch (filterName) {
    case "Private":
      defaultDict.private = 1;
      break;
    case "Important":
      defaultDict.important = 1;
      break;
    default:
      break;
  }
  if (startDate) {
    startDate = dayjs(startDate);
    if (startDate.isValid())
      defaultDict.startDeadline = startDate.format("YYYY-MM-DD");
  }
  if (endDate) {
    endDate = dayjs(endDate);
    if (endDate.isValid())
      defaultDict.endDeadline = endDate.format("YYYY-MM-DD");
  }
  return defaultDict;
}

const PORT = 3001;

app = new express();

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}/`)
);

// set-up the middlewares
app.use(morgan("dev"));
app.use(express.json()); // for parsing json request body




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




// GET /api/exams
app.get("/api/tasks", (req, res) => {
  const filter = req.query.filter ? req.query.filter : "All";
  const startDateFilter = req.query.startDate;
  const endDateFilter = req.query.endDate;
  const params = filterToParameters(filter, startDateFilter, endDateFilter);
  dao
    .filteredTasks(
      params.important,
      params.private,
      params.startDeadline,
      params.endDeadline
    )
    .then((exams) => res.json(exams))
    .catch(() => res.status(500).end());
});

