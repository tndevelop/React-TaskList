const fetchTasks = async () => {
    const response = await fetch('/api/tasks');
    const responseBody = await response.json();
    return responseBody;
};