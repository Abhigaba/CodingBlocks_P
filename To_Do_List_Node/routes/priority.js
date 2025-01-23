const {taskModel}  = require('../models/task');
const express = require('express')

const priorityRouter = express.Router() 

priorityRouter.patch("/:taskPriorityid", async (req, res) => {
    try {

        
        const taskPriorityid = req.params.taskPriorityid; 
        const priority = req.body.priorityChange;

        const currentTask = await taskModel.findById(taskPriorityid);
        if (!currentTask) {
            throw new Error('Task not found');
        }

        let swapTask;
        console.log(priority)
        if (priority === '1') { 
            swapTask = await taskModel
                .findOne({ priority: { $lt: currentTask.priority } })
                .sort({ priority: -1 }); 
            
        } else { 
            swapTask = await taskModel
                .findOne({ priority: { $gt: currentTask.priority } })
                .sort({ priority: 1 }); }

        if (!swapTask) {
            throw new Error('No task found to swap priorities with');
        }


        const tempPriority = currentTask.priority;
        currentTask.priority = swapTask.priority;
        swapTask.priority = tempPriority;

        await currentTask.save();
        await swapTask.save();

        res.send("Priorities successfully swapped");
    } catch (error) {
        console.log(error.message)
        res.status(400).send(error.message);
    }
});

module.exports = {
    priorityRouter,
};
