const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
        max:20
    },
    priority: {
        type : Number ,
        required: true
    }
})

const taskModel = new mongoose.model('tasks', taskSchema)

module.exports = {
    taskModel: taskModel
}