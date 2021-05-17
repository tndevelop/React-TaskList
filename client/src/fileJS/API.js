import { Task } from "../TaskListCreate";

const fetchTasks = async () => {
  const response = await fetch("/api/tasks");
  const responseBody = await response.json();
  return responseBody;
};

const fetchAddTask = async (task) => {
  const response = await fetch("/api/tasks", {
    method: "POST",
    body: JSON.stringify(task),
  });
  return response.status;
};

export { fetchTasks, fetchAddTask };