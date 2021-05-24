import { Task } from "../TaskListCreate";

const fetchTasks = async () => {
  const response = await fetch("/api/tasks");
  const responseBody = await response.json();
  return responseBody;
};

const fetchAddTask = async (task) => {
  debugger;
  const response = await fetch("/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
  return response.status;
};

const deleteTask = async (task)  => {
  debugger;
  const response = await fetch("api/tasks/delete/" + task.id, {
    method: "DELETE",
    /*headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
    */
  });
  
  if (response.ok) {
    return null;
  } else {
    try{
      return response.json()
    } catch{ 
      return "Cannot parse server response";
    }
  }
  
};

const API = { fetchAddTask, fetchTasks, deleteTask };
export default API;