const {taskModel}  = require('../models/task');
const express = require('express')

const deleteRouter = express.Router() 

deleteRouter.delete("/:taskid", async (req, res) => {

    try{
    const taskid = req.params.taskid; 
    await taskModel.findByIdAndDelete({_id: taskid})


    res.json({
        message : "Task deleted sucessfully",
    })

    }
    catch(error) {
        res.status(400).send(error.message);
    }

})


module.exports = {
    deleteRouter
}

