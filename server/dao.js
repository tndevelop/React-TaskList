'use strict';
/* Data Access Object (DAO) module for accessing courses and exams */

const sqlite = require('sqlite3');

// open the database
const db = new sqlite.Database('tasks.db', (err) => {
  if (err) throw err;
});


// get all tasks
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

//update a task
exports.updateTask = (task) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE tasks SET description=? important=? private=? deadline=? completed=? user=? WHERE id=?";
    db.run(sql, [task.description, task.important, task.private, task.deadline, task.completed, task.user],
      function(err) {
        if(err){
          reject(err);
          return;
        }
        resolve(task.id);
      })
  });
};

//delete a task
exports.deleteTask = (id) => {
  return new Promise((resolve,reject) => {
    sql = "DELETE FROM tasks WHERE id=?";
    db.run(sql, [id], function (err) {
      if(err){
        reject(err);
        return;
      }
      resolve(null);
    })
  });
};