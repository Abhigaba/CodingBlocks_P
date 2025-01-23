const {taskModel} = require('../models/task');
const express = require('express')

const addRouter = express.Router() 

addRouter.get("/:task", async (req, res) => {

    try {
        const taskName = req.params.task;
    
        const maxPriorityTask = await taskModel.findOne().sort({ priority: -1 });
    
        const newPriority = maxPriorityTask ? maxPriorityTask.priority + 1 : 1;
    
        const newTask = new taskModel({
            name: taskName,
            priority: newPriority,
        });
    
        console.log(newTask);
        await newTask.save();
    
        res.json({
            message: "Task added successfully",
            data: newTask,
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
})
module.exports = {
    addRouter
}

