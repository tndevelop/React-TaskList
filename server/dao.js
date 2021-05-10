"use strict";
/* Data Access Object (DAO) module for accessing courses and exams */


const sqlite = require('sqlite3');
const dayjs = require("dayjs");
// open the database
const db = new sqlite.Database('tasks.db', (err) => {
    if (err) throw err;
});



// get all courses
exports.listTasks = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM tasks';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const courses = rows.map((t) => ({ id: t.id, description: t.description, important: t.important, private: t.private, deadline: t.deadline }));
            resolve(courses);
        });
    });
};

exports.getTaskById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM tasks WHERE id=?';
        db.get(sql, [id], (err, row) => {
            console.log(id);
            if (err) {
                reject(err);
                return;
            }   
            if (row == undefined) {
                resolve({ error: 'Task not found.' });
            } else {
                const task = { id: row.id, description: row.description, important: row.important, private: row.private, deadline: row.deadline };
                resolve(task);
            }
        });
    }); 
};


exports.filteredTasks = (important, isPrivate, startDeadline, endDeadline) => {
  let query = `SELECT * FROM tasks`;

  let whereClause = [];
  if (important) whereClause.push(`important=${important}`);
  if (isPrivate) whereClause.push(`private=${isPrivate}`);
  if (startDeadline) whereClause.push(`deadline >= '${startDeadline}'`);
  if (endDeadline) whereClause.push(`deadline <= '${endDeadline}'`);
  if (whereClause.length !== 0) query += " WHERE " + whereClause.join(" AND ");
  return new Promise((resolve, reject) => {
    db.all(query, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const courses = rows.map((t) => ({
        id: t.id,
        description: t.description,
        important: t.important,
        private: t.private,
        deadline: t.deadline,
      }));
      resolve(courses);
    });
  });
};

//update a task
exports.updateTask = (task) => {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE tasks SET description=? important=? private=? deadline=? completed=? user=? WHERE id=?";
    db.run(
      sql,
      [
        task.description,
        task.important,
        task.private,
        task.deadline,
        task.completed,
        task.user,
      ],
      function (err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(task.id);
      }
    );
  });
};

//delete a task
exports.deleteTask = (id) => {
  return new Promise((resolve, reject) => {
    sql = "DELETE FROM tasks WHERE id=?";
    db.run(sql, [id], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(null);
    });
  });
};
