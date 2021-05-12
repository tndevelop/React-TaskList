const express = require('express');
const morgan = require("morgan"); // logging middleware
const { check, query, validationResult } = require("express-validator"); // validation middleware
const dao = require("./dao"); // module for accessing the DB
const dayjs = require("dayjs");
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
dayjs.extend(isSameOrAfter);
const { response } = require('express');

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

const compareTasks = (task1, task2) => {
  let temp1 = task1;
  delete temp1.id;
  delete temp1.completed;
  let temp2 = task2;
  delete temp1.id;
  delete temp1.completed;
  if(temp1===temp2){
    return true;
  }
  return false;
};

const PORT = 3002;
app = new express();

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}/`)
);

// set-up the middlewares
app.use(morgan("dev"));
app.use(express.json()); // for parsing json request body




// GET /api/tasks
/*
app.get('/api/tasks', (req, res) => {
    dao.listTasks()
    .then(exams => res.json(exams))
    .catch(()=> res.status(500).end());
  });
*/



// GET /api/tasks
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


//GET /api/tasks/:id
app.get('/api/tasks/:id', (req, res) => {

  dao.getTaskById(req.params.id)
    .then(exam => res.json(exam))
    .catch((err) => {
      if (err.code == 404) {
        res.status(404).json(err);
      }
      res.status(500).end();
    });
});


//add a new task
app.post('/api/tasks', [
  check('description').exists(),
  check('deadline').if(deadline => deadline).custom((deadline) => Date.parse(deadline) && dayjs(deadline).isSameOrAfter(dayjs(), "day")),
  check('private').isBoolean(),
  check('important').isBoolean(),
  check('completed').isBoolean()], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      //await dao.updateExam(examToUpdate);
      const task = req.body;
      await dao.createTask(task);
      res.status(200).end();
    } catch (err) {
      res.status(503).json({ error: `Database error while adding the task: ${err}` });
    }
  });


//update an existing task
app.put("api/tasks/update", [
  check('description').exists(),
  check('deadline').if(deadline => deadline).custom((deadline) => Date.parse(deadline) && dayjs(deadline).isSameOrAfter(dayjs(), "day")),
  check('private').isBoolean(),
  check('important').isBoolean(),
  check('completed').isBoolean()], async (req, res) => {
    const errores = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
    }
    try {
      const task = req.body;
      await dao.updateTask(task);
      return res.status(200).end();
    }
    catch (err) {
      res.status(503).json({ error: `Database error during the update of the task ${task}` });
    }
  });


//mark a task as completed/uncompleted
app.put("api/tasks/update/mark", [
  check('description').exists(),
  check('deadline').if(deadline => deadline).custom((deadline) => Date.parse(deadline) && dayjs(deadline).isSameOrAfter(dayjs(), "day")),
  check('private').isBoolean(),
  check('important').isBoolean(),
  check('completed').isBoolean()], async (req, res) => {
    const errores = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      const task = req.body;
      const existingTask = await dao.getTaskById(task.id);
      if (compareTasks(task, existingTask)) {
        await dao.updateTask(task);
        res.status(200).end();
      }
      else {
        res.status(400).json({ error: "All fields of the task must be unchanged, except for the completed/uncompleted flag" });
      }
    }
    catch (err) {
      res.status(503).json({ error: `Database error during the marking of the task ${task}` });
    }
  });


app.delete('api/tasks/delete/:id', async (req, res) => {
  try {
    await dao.deleteTask(req.params.id);
    res.status(204).end();
  }
  catch (err) {
    res.status(503).json({ error: `Database error during deletion of task ${req.params.id}` });
  }
});