const mongoose = require('mongoose') ;

const  puserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String
    }
});

const puserModel = mongoose.model('puser', puserSchema)
module.exports = {puser : puserModel}