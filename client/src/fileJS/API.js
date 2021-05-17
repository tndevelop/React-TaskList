import { Task } from "../TaskListCreate";

const fetchTasks = async () => {
<<<<<<< HEAD
    const response = await fetch('/api/tasks');
    console.log("resp :"+ response);
    const responseBody = await response.json();
    console.log("resp body:"+ responseBody);
    return responseBody;
};

export { fetchTasks };
=======
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
>>>>>>> 9c1385b6d2e5ee67c9b25710fb88ca6dd522b40d
