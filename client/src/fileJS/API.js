const fetchTasks = async () => {
    const response = await fetch('/api/tasks');
    console.log("resp :"+ response);
    const responseBody = await response.json();
    console.log("resp body:"+ responseBody);
    return responseBody;
};

export { fetchTasks };