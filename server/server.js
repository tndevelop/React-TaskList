const express = require('express');
const dao = require("./dao");
const { check, validationResult } = require('express-validator');
const PORT = 3001;

app = new express();


//update an existing exam
app.put("api/tasks/update/:id", async (req,res) => {
    const task = req.body;
    try{
        await dao.updateTask(task);
        res.status(200).end();
    }
    catch(err){
        res.status(503).json({error:`Database error during the update of the task ${task}`});
    }
});



app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));
