import dayjs from 'dayjs';

const BASEURL = '/api';

const fetchTasks = async (filter) => {
  const response = await fetch(`/api/tasks?filter=${filter}`);
  const responseBody = await response.json();
  return responseBody;
};

const fetchAddTask = async (task) => {
  task.deadline = dayjs(task.deadline).format('YYYY-MM-DD HH:mm');
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
  task.deadline = dayjs(task.deadline).format('YYYY-MM-DD HH:mm');
  const response = await fetch("/api/tasks/update",
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
  const response = await fetch("/api/tasks/update/mark",
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
  const response = await fetch("/api/tasks/delete/" + task.id, {
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

async function logIn(credentials) {
  let response = await fetch('/api/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  if(response.ok) {
    const user = await response.json();
    return user.name;
  }
  else {
    try {
      const errDetail = await response.json();
      throw errDetail.message;
    }
    catch(err) {
      throw err;
    }
  }
}

async function logOut() {
  await fetch('/api/sessions/current', { method: 'DELETE' });
}

async function getUserInfo() {
  const response = await fetch(BASEURL + '/sessions/current');
  const userInfo = await response.json();
  if (response.ok) {
    return userInfo;
  } else {
    throw userInfo;  // an object with the error coming from the server
  }
}

const API = { fetchAddTask, fetchTasks, fetchUpdateTask, fetchMarkTask, fetchDeleteTask, getUserInfo, logOut, logIn };
export default API;