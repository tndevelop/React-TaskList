import dayjs from 'dayjs';

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
  if(task.deadline){
    task.deadline = dayjs(task.deadline);
    task.deadline = task.deadline.format('YYYY-MM-DD HH:mm');
  }
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
  //debugger;
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