import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import React from "react";
import { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import MyNavbar from "./components/MyNavbar";
import "./components/TaskList.js";
import { Task, List } from "./TaskListCreate";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { CentralRow } from "./components/CentralRow";
import API from './fileJS/API.js';
import dayjs from 'dayjs';

// create the task list and add the dummy tasks
// id, description, urgent, private, deadline
const DummyTaskList = new List();
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
    if (dirty && filter!=="undef") {
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

  const setDone = async (task, done) => {
    deleteLocal(task);
    addElementAndRefresh(task.description, task.important, task.private, task.deadline, done, "warning");
    task.setDone(done);
    await API.fetchMarkTask(task);
    setDirty(true);
    
  };

  const removeTask = async (task) => {
    //DummyTaskList.remove(task);
    //setTaskList((taskList) => taskList.filter((t) => t.id !== task.id));
    deleteLocal(task);
    addElementAndRefresh(task.description, task.important, task.private, task.deadline, task.completed, "danger");//add the task with the status alert
    await API.fetchDeleteTask(task);
    setDirty(true);
  };

  const markTask = (task) => {
    task.completed = !task.completed;
    API.fetchMarkTask(new Task(task.id, task.description, task.important, task.private, task.deadline, task.completed, task.user));
    setDirty(true);
  }
  /**
   * Apply filter to `taskList`
   * @param {string} filterName
   * @returns {Array<Task>} filtered list
   */
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
              if (loading) {
                return (<p id="loading">Please wait, loading your tasks...</p>);
              }
              
              else {
                return (<CentralRow
                  selectedFilter={match.params.selectedFilter}
                  setFilter={setFilter}
                  setDone={setDone}
                  createElement={addElementAndRefresh}
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
              if (loading) {
                return (<p id="loading">Please wait, loading your tasks...</p>);
              }
              else {
                return (<CentralRow
                  selectedFilter={"All"}
                  setFilter={setFilter}
                  setDone={setDone}
                  createElement={addElementAndRefresh}
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
