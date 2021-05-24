import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row } from "react-bootstrap";
import React from "react";
import { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import MyNavbar from "./components/MyNavbar";
import "./components/TaskList.js";
import { List } from "./TaskListCreate";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { CentralRow } from "./components/CentralRow";
import API from './fileJS/API.js';
import dayjs from 'dayjs';

// create the task list and add the dummy tasks
// id, description, urgent, private, deadline
const DummyTaskList = new List();

/*DummyTaskList.createElement("laundry", false, true);
DummyTaskList.createElement(
  "monday lab",
  false,
  false,
  "2021-06-16T09:00:00.000Z"
);
DummyTaskList.createElement(
  "phone call",
  true,
  false,
  "2021-06-08T15:20:00.000Z"
);
DummyTaskList.createElement("lab", true, false, "2021-07-04T15:20:00.000Z");
DummyTaskList.createElement("study", false, true, "2021-07-10T15:20:00.000Z");
*/
function App() {
  const [taskList, setTaskList] = useState([]); /*DummyTaskList.getList()*/
  const [addedTask, setAddedTask] = useState(false);
  const [filter, setFilter] = useState("Undef");
  const [loading, setLoading] = useState(true);
  const [dirty, setDirty] = useState(true);

  useEffect(() => {
    const getTasks = async () => {
      const tasks = await API.fetchTasks(filter);
      tasks.map(t => t.deadline = t.deadline ? dayjs(t.deadline) : ""); //deadline from string to dayjs
      DummyTaskList.reset();
      tasks.forEach(t => DummyTaskList.createElementFromServer(t.id, t.description, t.important, t.private, t.deadline, t.completed, t.user));
      setTaskList(DummyTaskList.getList());
    }
    if (dirty && filter!="undef") {
      getTasks().then(() => {
        setLoading(false);
        setDirty(false);
        
      });
    }
  }, [dirty, filter]);

  const addElementAndRefresh = (description, isUrgent, isPrivate, deadline, isCompleted, status) => {
    DummyTaskList.createElement(description, isUrgent, isPrivate, deadline, isCompleted, status);
    setTaskList(DummyTaskList.getList());
    setAddedTask(!addedTask);
  };

  const deleteLocal = (task) => {
    DummyTaskList.remove(task);
    setTaskList((taskList) => taskList.filter((t) => t.id !== task.id));

  };



  const setDone = (task, done) => {
    task.setDone(done);
  };

  const removeTask = (task) => {
    DummyTaskList.remove(task);
    setTaskList((taskList) => taskList.filter((t) => t.id !== task.id));
    API.fetchDeleteTask(task);
    setDirty(false);
  };
  /**
   * Apply filter to `taskList`
   * @param {string} filterName
   * @returns {Array<Task>} filtered list
   */
  const applyFilter = (filterName) => {
    switch (filterName) {
      case "Private":
        return taskList.filter((t) => t.isPrivate());
      case "Important":
        return taskList.filter((t) => t.isImportant());
      case "Next7":
        return taskList.filter((t) => t.isNextWeek());
      case "Today":
        return taskList.filter((t) => t.isToday());
      default:
        return taskList;
    }
  };

  return (
    <Router>
      <Container fluid="true">
        <MyNavbar></MyNavbar>
        <Switch>
          <Route
            exact
            path="/:selectedFilter"
            render={({ match }) => {
              
              const filters = ["All", "Private", "Important", "Next7Days", "Today"];
              if (!filters.includes(match.params.selectedFilter)) {
                setFilter("All");
              }
              else {
                setFilter(match.params.selectedFilter);
              }
  
              //setDirty(true);
              //debugger;
              
              if (loading) {
                return (<p id="loading">Please wait, loading your tasks...</p>);
              }
              
              else {
                return (<CentralRow
                  selectedFilter={match.params.selectedFilter}
                  setFilter={setFilter}
                  setDone={setDone}
                  createElement={addElementAndRefresh}
                  //taskList={applyFilter(match.params.selectedFilter)}
                  taskList={taskList}
                  removeTask={removeTask}
                  setDirty={setDirty}
                  setLoading={setLoading}
                  deleteLocal={deleteLocal}
                ></CentralRow>);
              }
            }} />
          <Route
            exact
            path="/"
            render={() => {
              //setDirty(true);
              if (loading) {
                return (<p id="loading">Please wait, loading your tasks...</p>);
              }
              else {
                return (<CentralRow
                  selectedFilter={"All"}
                  setFilter={setFilter}
                  setDone={setDone}
                  createElement={addElementAndRefresh}
                  //taskList={applyFilter(filter)}
                  taskList={taskList}
                  removeTask={removeTask}
                  setDirty={setDirty}
                  setLoading={setLoading}
                  deleteLocal={deleteLocal}
                ></CentralRow>);
              }
            }
            }
          />
        </Switch>
      </Container>
    </Router>
  );
}

export default App;
