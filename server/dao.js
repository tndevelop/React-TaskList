'use strict';
/* Data Access Object (DAO) module for accessing courses and exams */

const sqlite = require('sqlite3');

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
