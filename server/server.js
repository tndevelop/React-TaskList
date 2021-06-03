const express = require("express");
const morgan = require("morgan"); // logging middleware
const { check, query, validationResult } = require("express-validator"); // validation middleware
const dao = require("./dao"); // module for accessing the DB
const dayjs = require("dayjs");
const isSameOrAfter = require("dayjs/plugin/isSameOrAfter");
dayjs.extend(isSameOrAfter);
const { response } = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");

/*id,description,important, private, deadline, complete, user */
function filterToParameters(filterName, startDate, endDate, user) {
  let defaultDict = {
    important: undefined,
    private: undefined,
    startDeadline: undefined,
    endDeadline: undefined,
    userId: undefined,
  };
  switch (filterName) {
    case "Private":
      defaultDict.private = 1;
      break;
    case "Important":
      defaultDict.important = 1;
      break;
    case "Today":
      defaultDict.startDeadline = dayjs().format("YYYY-MM-DD");
      defaultDict.endDeadline = dayjs().add(1, "day").format("YYYY-MM-DD");
      break;
    case "Next7Days":
      defaultDict.startDeadline = dayjs().format("YYYY-MM-DD");
      defaultDict.endDeadline = dayjs().add(8, "day").format("YYYY-MM-DD");
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

  if(user){
    defaultDict.userId = user;
  }

  return defaultDict;
}

const compareTasks = (taskReq, taskDB) => {
  equal_values = true;
  for (key in taskDB) {
    if (key == "completed" || taskReq[key] == taskDB[key]) {
      continue;
    } else {
      equal_values = false;
      break;
    }
  }
  return equal_values;
};

const PORT = 3001;
app = new express();

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}/`)
);

// set-up the middlewares
app.use(morgan("dev"));
app.use(express.json()); // for parsing json request body

/*** PASSPORT SETUP ***/

passport.use(
  new LocalStrategy(function (username, password, done) {
    dao.getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, {
          message: "Incorrect username and/or password.",
        });
      return done(null, user);
    });
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  dao
    .getUserById(id)
    .then((user) => {
      done(null, user); // req.user
    })
    .catch((err) => {
      done(err, null);
    });
});

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.status(400).json({ error: "Not authorized" });
};

/*** SESSION ***/

// enable sessions in Express
app.use(
  session({
    // set up here express-session
    secret:
      "una frase segreta da non condividere con nessuno e da nessuna parte, usata per firmare il cookie Session ID",
    resave: false,
    saveUninitialized: false,
  })
);

// init Passport to use sessions
app.use(passport.initialize());
app.use(passport.session());

/*** Tasks APIs ***/

// GET /api/tasks
app.get("/api/tasks",  isLoggedIn, (req, res) => {
  const filter = req.query.filter ? req.query.filter : "All";
  const user = req.query.user;
  const startDateFilter = req.query.startDate;
  const endDateFilter = req.query.endDate;
  //const params = filterToParameters(filter, startDateFilter, endDateFilter, user);
  const params = filterToParameters(filter, startDateFilter, endDateFilter);
  setTimeout(
    () =>
      dao
        .filteredTasks(
          params.important,
          params.private,
          params.startDeadline,
          params.endDeadline,
          req.user.id
          //params.userId
        )
        .then((tasks) => res.json(tasks))
        .catch(() => res.status(500).end()),
    1000
  );
});

//GET /api/tasks/:id
app.get("/api/tasks/:id", isLoggedIn, (req, res) => {
  dao
    .getTaskById(req.params.id)
    .then((exam) => res.json(exam))
    .catch((err) => {
      if (err.code == 404) {
        res.status(404).json(err);
      }
      res.status(500).end();
    });
});

//POST /api/tasks
app.post(
  "/api/tasks",
  isLoggedIn,
  [
    check("description").exists(),
    check("deadline")
      .if((deadline) => deadline)
      .custom(
        (deadline) =>
          Date.parse(deadline) && dayjs(deadline).isSameOrAfter(dayjs(), "day")
      ),
    check("private").isBoolean(),
    check("important").isBoolean(),
    check("completed").isBoolean()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      //await dao.updateExam(examToUpdate);
      let task = req.body;
      task.user = req.user.id;
      //task.deadline = dayjs(task.deadline).format("YYYY-MM-DD HH:mm");
      let id = await dao.getId();
      console.log("create task");
      await dao.createTask(task, id);
      res.status(200).end();
    } catch (err) {
      res
        .status(503)
        .json({ error: `Database error while adding the task: ${err}` });
    }
  }
);

//PUT /api/tasks/update
app.put(
  "/api/tasks/update",
  isLoggedIn,
  [
    check("description").exists(),
    check("deadline")
      .if((deadline) => deadline)
      .custom(
        (deadline) =>
          Date.parse(deadline) && dayjs(deadline).isSameOrAfter(dayjs(), "day")
      ),
    check("private").isBoolean(),
    check("important").isBoolean(),
    check("completed").isBoolean(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
    }
    const task = req.body;
    task.user = req.user.id;
    console.log(task);
    try {
      await dao.updateTask(task);
      return res.status(200).end();
    } catch (err) {
      res.status(503).json({
        error: `Database error during the update of the task ${task}, error: ${err}`,
      });
    }
  }
);

//PUT /api/tasks/update/mark
app.put(
  "/api/tasks/update/mark",
  isLoggedIn,
  [
    check("description").exists(),
    check("deadline")
      .if((deadline) => deadline)
      .custom(
        (deadline) => Date.parse(deadline) // && dayjs(deadline).isSameOrAfter(dayjs(), "day")
      ),
    check("private").isBoolean(),
    check("important").isBoolean(),
    check("completed").isBoolean(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const task = req.body;
    task.user = req.user.id;
    try {
      const existingTask = await dao.getTaskById(task.id);

      if (compareTasks(task, existingTask)) {
        await dao.updateTask(task);
        res.status(200).end();
      } else {
        res.status(400).json({
          error:
            "All fields of the task must be unchanged, except for the completed/uncompleted flag",
        });
      }
    } catch (err) {
      res.status(503).json({
        error: `Database error during the marking of the task ${task}`,
      });
    }
  }
);

//DELETE /api/tasks/delete/:id
app.delete("/api/tasks/delete/:id", isLoggedIn, async (req, res) => {
  try {
    await dao.deleteTask(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(503).json({
      error: `Database error during deletion of task ${req.params.id}`,
    });
  }
});

/*** User APIs ***/
app.post("/api/sessions", passport.authenticate("local"), (req, res) => {
  res.json(req.user);
});

app.get("/api/sessions/current", (req, res) => {
  if (req.isAuthenticated()) res.json(req.user);
  else res.status(401).json({ error: "Not authenticated" });
});

// DELETE /sessions/current 
// logout
app.delete('/api/sessions/current', (req, res) => {
  req.logout();
  res.end();
});