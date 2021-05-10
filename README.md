# BigLab 2 - Class: 2021 AW1 M-Z

## Team name: TEAM_NAME

Team members:
* s281879 MARSIANO JONATHAN
* s123456 LASTNAME FIRSTNAME 
* s123456 LASTNAME FIRSTNAME
* s123456 LASTNAME FIRSTNAME (delete line if not needed)

## Instructions

A general description of the BigLab 2 is avaible in the `course-materials` repository, [under _labs_](https://github.com/polito-WA1-AW1-2021/course-materials/tree/main/labs/BigLab2/BigLab2.pdf). In the same repository, you can find the [instructions for GitHub Classroom](https://github.com/polito-WA1-AW1-2021/course-materials/tree/main/labs/GH-Classroom-BigLab-Instructions.pdf), covering this and the next BigLab.

Once cloned this repository, instead, write your names in the above section.

When committing on this repository, please, do **NOT** commit the `node_modules` directory, so that it is not pushed to GitHub.
This should be already automatically excluded from the `.gitignore` file, but double-check.

When another member of the team pulls the updated project from the repository, remember to run `npm install` in the project directory to recreate all the Node.js dependencies locally, in the `node_modules` folder.

Finally, remember to add the `final` tag for the final submission, otherwise it will not be graded.

## List of APIs offered by the server

Provide a short description for API with the required parameters, follow the proposed structure.

* [HTTP Method] [URL, with any parameter]
* [One-line about what this API is doing]
* [Sample request, with body (if any)]
* [Sample response, with body (if any)]
* [Error responses, if any]


### __Mark task as completed/uncompleted__

URL: `api/tasks/update`

Method: PUT

Description: Mark an existing task  as completed/uncompleted

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