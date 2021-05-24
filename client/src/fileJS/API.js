import { Task } from "../TaskListCreate";

const fetchTasks = async () => {
  const response = await fetch("/api/tasks");
  const responseBody = await response.json();
  return responseBody;
};

const fetchAddTask = async (task) => {
  const response = await fetch("/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(task)
  });
  return response.status;
};

const fetchUpdateTask = async (task) => {
  const response = await fetch("api/tasks/update",
  {
    method:'PUT',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(task)
  });
  return response.status;
};

const API = { fetchAddTask, fetchTasks, fetchUpdateTask };
export default API;