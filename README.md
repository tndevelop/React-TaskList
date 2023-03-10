# BigLab 2 - Class: 2021 AW1 M-Z

## Team name: CodingInTheShadows

Team members:

- s281879 MARSIANO JONATHAN
- s282478 NATTA TOMMASO
- s281933 ORLANDO LUCA
- s290144 REGE CAMBRIN DANIELE

## Instructions

A general description of the BigLab 2 is avaible in the `course-materials` repository, [under _labs_](https://github.com/polito-WA1-AW1-2021/course-materials/tree/main/labs/BigLab2/BigLab2.pdf). In the same repository, you can find the [instructions for GitHub Classroom](https://github.com/polito-WA1-AW1-2021/course-materials/tree/main/labs/GH-Classroom-BigLab-Instructions.pdf), covering this and the next BigLab.

Once cloned this repository, instead, write your names in the above section.

When committing on this repository, please, do **NOT** commit the `node_modules` directory, so that it is not pushed to GitHub.
This should be already automatically excluded from the `.gitignore` file, but double-check.

When another member of the team pulls the updated project from the repository, remember to run `npm install` in the project directory to recreate all the Node.js dependencies locally, in the `node_modules` folder.

Finally, remember to add the `final` tag for the final submission, otherwise it will not be graded.

## List of APIs offered by the server

Provide a short description for API with the required parameters, follow the proposed structure.

- [HTTP Method] [URL, with any parameter]
- [One-line about what this API is doing]
- [Sample request, with body (if any)]
- [Sample response, with body (if any)]
- [Error responses, if any]

### **List all tasks**

URL: `/api/tasks`

HTTP Method: GET

Description: Get all tasks of the task list.

Request body: _None_

Response: `200 OK` (success) or `500 Internal Server Error` (generic error)

Response body:

```json
[
	{
		"id": 2,
		"description": "Go for a walk",
		"important": 1,
		"private": 1,
		"deadline": "2021-04-14 08:30"
	},
	{
		"id": 4,
		"description": "Watch the Express videolecture",
		"important": 1,
		"private": 1,
		"deadline": "2021-05-24 09:00"
	}
    ...
]
```

### **Filter tasks**

URL: `/api/task?filter=<filterName>&startDate=<startDate>&endDate=<endDate>`

HTTP Method: GET

Description: Get all task that satisfy constraints of `filterName` and whose `deadline` are between `startDate` and `endDate`. Query parameters are optional.

Request: `/api/task?filter=All&startDate=2020-01-01+00:00&endDate=2021-06-01+16:00`

Response: `200 OK` (success) or `500 Internal Server Error` (generic error)

Response body:

```json
[
    {
		"id": 2,
		"description": "Go for a walk",
		"important": 1,
		"private": 1,
		"deadline": "2021-04-14 08:30"
    },
    {
        "id": 4,
		"description": "Watch the Express videolecture",
		"important": 1,
		"private": 1,
		"deadline": "2021-05-24 09:00"
    }
    ...
]
```

### **Get task by id**

URL: `/api/tasks/:id`

HTTP Method: GET

Description: Get a single task of the list given it's id.

Request body: _None_

Response: `200 OK` (success) or `500 Internal Server Error` (generic error) or `404 Not Found` (wrong code)

Response body:

```
{
	"id": 2,
	"description": "Go for a walk",
	"important": 1,
	"private": 1,
	"deadline": "2021-04-14 08:30"
}
```

### **Create a new task**

URL: `/api/tasks`

HTTP Method: POST

Description: Insert a new task

Request body: An object that represents a task(Content-type: `Application/json`)

```
{
    "description": "eat lunch",
    "deadline": "2021-07-22 12:45",
    "important": 1,
    "private": 0,
    "completed": 0

}
```

Response: `200 OK` (success) or `503 generic error` or `422 Unprocessable Entity`

Response body: _None_

### **Update task**

URL: `api/tasks/update`

Method: PUT

Description: Update entirely an existing task, identified by its id.

Request body: An object representing the entire task (Content-Type: `application/json`)

```
{
    "id":2
    "description":"Go for a walk"
    "important":1
    "private":1
    "deadline":"2021-04-14 08:30"
    "completed":1
    "user":1
}
```

Response: `200 OK` (success) or `503 Service Unavailable` (generic error). If the request body is not valid, `422 Unprocessable Entity` (validation error).

Response body: _None_

### **Mark a task**

URL: `api/tasks/update/mark`

Method: PUT

Description: Mark an existing task as completed/uncompleted.

Request body: An object representing the entire task (Content-Type: `application/json`), with a different value in the "completed" flag.

```
{
    "id":2
    "description":"Go for a walk"
    "important":1
    "private":1
    "deadline":"2021-04-14 08:30"
    "completed":1
    "user":1
}
```

Response: Response: `200 OK` (success) or `503 Service Unavailable` (generic error). If the request body is not valid, `422 Unprocessable Entity` (validation error).

Response body: _None_

### **Delete task**

URL: `api/task/delete/<id>`

Method: DELETE

Description: Delete an existing task, identified by its id.

Request body: _None_

Response: `204 No Content` (success) or `503 Service Unavailable` (generic error).

Response body: _None_
