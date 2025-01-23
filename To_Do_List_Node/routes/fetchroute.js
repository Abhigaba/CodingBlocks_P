const {taskModel}  = require('../models/task');
const express = require('express')

const fetchRouter = express.Router() 

fetchRouter.get("/", async (req, res) => {

    try{
    
        const data = await taskModel.find({})
    res.json({
        message : "Data fetched sucessfully",
        data: data
    })
    }
    catch(error) {
        res.status(400).send(error.message);
    }

})

module.exports = {
    fetchRouter
}



