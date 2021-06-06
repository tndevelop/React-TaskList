import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import React from "react";
import { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import MyNavbar from "./components/MyNavbar";
import "./components/TaskList.js";
import { List } from "./TaskListCreate";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { CentralRow } from "./components/CentralRow";
import {
  LoginForm,
  LogoutButtonAndWelcomeUser,
} from "./components/LoginForm.js";
import API from "./fileJS/API.js";
import dayjs from "dayjs";

// create the task list and add the dummy tasks
// id, description, urgent, private, deadline
const DummyTaskList = new List();
function App() {
  const [taskList, setTaskList] = useState([]); /*DummyTaskList.getList()*/
  const [addedTask, setAddedTask] = useState(false);
  //const [filter, setFilter] = useState("Undef");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [dirty, setDirty] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({ id: -1 });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userInfo = await API.getUserInfo();
        setUser({ id: userInfo.id, name: userInfo.name });
        setLoggedIn(true);
      } catch (err) {
        console.log(err.error);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const getTasks = async () => {
      if (loggedIn) {
        //const tasks = await API.fetchTasks(filter, user);
        const tasks = await API.fetchTasks(filter);
        tasks.map((t) => (t.deadline = t.deadline ? dayjs(t.deadline) : "")); //deadline from string to dayjs
        DummyTaskList.reset();
        tasks.forEach((t) =>
          DummyTaskList.createElementFromServer(
            t.id,
            t.description,
            t.important,
            t.private,
            t.deadline,
            t.completed,
            t.user
          )
        );
        setTaskList(DummyTaskList.getList());
      }
    };
    if (dirty && loggedIn) {
      getTasks()
        .then(() => {
          setLoading(false);
          setDirty(false);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [dirty, filter, loggedIn]);
  //}, [dirty, filter, user.id]);

  const addElementAndRefresh = (
    description,
    isUrgent,
    isPrivate,
    deadline,
    isCompleted,
    status
  ) => {
    DummyTaskList.createElement(
      description,
      isUrgent,
      isPrivate,
      deadline,
      isCompleted,
      user.id, //user is a state variable
      status
    );

    setTaskList(DummyTaskList.getList());

    setAddedTask(!addedTask);
  };

  const deleteLocal = (task) => {
    DummyTaskList.remove(task);
    setTaskList((taskList) => taskList.filter((t) => t.id !== task.id));
  };

  const setDone = async (task, done) => {
    deleteLocal(task);
    addElementAndRefresh(
      task.description,
      task.important,
      task.private,
      task.deadline,
      done,
      "warning"
    );
    task.setDone(done);
    await API.fetchMarkTask(task);
    setDirty(true);
  };

  const removeTask = async (task) => {
    //DummyTaskList.remove(task);
    //setTaskList((taskList) => taskList.filter((t) => t.id !== task.id));
    deleteLocal(task);
    addElementAndRefresh(
      task.description,
      task.important,
      task.private,
      task.deadline,
      task.completed,
      "danger"
    ); //add the task with the status alert
    await API.fetchDeleteTask(task);
    setDirty(true);
  };

  const doLogIn = async (credentials) => {
    try {
      const response = await API.logIn(credentials);
      if (response) {
        setUser({ id: response.id, name: response.name });
        setLoggedIn(true);
        setDirty(true); //così viene eseguita la useEffect
        return response.name;
      }
    } catch (e) {
      return "Incorrect username and/or password";
    }
  };

  const doLogOut = () => {
    API.logOut()
      .then((val) => setLoggedIn(false))
      .catch((err) => console.log(err));
    // clean up everything
    DummyTaskList.reset();
    setTaskList(DummyTaskList.getList());
  };

  return (
    <Router>
      <Container fluid="true">
        <MyNavbar></MyNavbar>
        <Switch>
          <Route
            path="/login"
            render={() => (
              <>
                {loggedIn ? (
                  <Redirect to={"/" + filter} />
                ) : (
                  <LoginForm login={doLogIn} />
                )}
              </>
            )}
          />
          <Route
            exact
            path="/:selectedFilter"
            render={({ match }) => {
              const filters = [
                "All",
                "Private",
                "Important",
                "Next7Days",
                "Today",
              ];
              if (!filters.includes(match.params.selectedFilter)) {
                setFilter("All");
              } else {
                setFilter(match.params.selectedFilter);
              }

              if (loading) {
                return (
                  <>
                    {loggedIn ? (
                      <p id="loading">Please wait, loading your tasks...</p>
                    ) : (
                      <Redirect to="/login" />
                    )}
                  </>
                );
              } else {
                return (
                  <>
                    {loggedIn ? (
                      <>
                        <LogoutButtonAndWelcomeUser
                          logout={doLogOut}
                          username={user.name}
                        />
                      </>
                    ) : (
                      <Redirect to="/login" />
                    )}
                    <CentralRow
                      selectedFilter={match.params.selectedFilter}
                      setFilter={setFilter}
                      setDone={setDone}
                      createElement={addElementAndRefresh}
                      taskList={taskList}
                      removeTask={removeTask}
                      setDirty={setDirty}
                      setLoading={setLoading}
                      deleteLocal={deleteLocal}
                      userId={user.id}
                    ></CentralRow>
                  </>
                );
              }
            }}
          />
          <Route
            exact
            path="/"
            render={() => {
              setFilter("All");
              if (loading) {
                return (
                  <>
                    {loggedIn ? (
                      <p id="loading">Please wait, loading your tasks...</p>
                    ) : (
                      <Redirect to="/login" />
                    )}
                  </>
                );
                //{ loggedIn ? <p id="loading">Please wait, loading your tasks...</p> : <Redirect to="/login" /> }
                //return (<p id="loading">Please wait, loading your tasks...</p>);
              } else {
                return (
                  <>
                    {loggedIn ? (
                      <>
                        <LogoutButtonAndWelcomeUser
                          logout={doLogOut}
                          username={user.name}
                        />
                      </>
                    ) : (
                      <Redirect to="/login" />
                    )}
                    <CentralRow
                      selectedFilter={"All"}
                      setFilter={setFilter}
                      setDone={setDone}
                      createElement={addElementAndRefresh}
                      taskList={taskList}
                      removeTask={removeTask}
                      setDirty={setDirty}
                      setLoading={setLoading}
                      deleteLocal={deleteLocal}
                      userId={user.id}
                    ></CentralRow>
                  </>
                );
              }
            }}
          />
        </Switch>
      </Container>
    </Router>
  );
}

export default App;
