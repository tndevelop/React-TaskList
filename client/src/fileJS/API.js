import { Task } from "../TaskListCreate";

const fetchTasks = async (filter) => {
  const response = await fetch(`/api/tasks?filter=${filter}`);
  const responseBody = await response.json();
  return responseBody;
};

const fetchAddTask = async (task) => {
  const response = await fetch("/api/tasks", {
    method:"POST",
    headers: {
      "Content-Type":"application/json"
    },
    body:JSON.stringify(task)
  });
  return response.status;
};

const fetchUpdateTask = async (task) => {
  const response = await fetch("api/tasks/update",
  {
    method:"PUT",
    headers: {
      "Content-Type":"application/json"
    },
    body:JSON.stringify(task)
  });
  return response.status;
};

const fetchMarkTask = async (task) => {
  const response = await fetch("api/tasks/update/mark",
  {
    method:"PUT",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify(task)
  });
  return response.status;
};

const fetchDeleteTask = async (task)  => {
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

const API = { fetchAddTask, fetchTasks, fetchUpdateTask, fetchMarkTask, fetchDeleteTask };
export default API;