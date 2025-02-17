const mongoose = require('mongoose'); 

const blogSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'author',
        required: 'true'
    },
    content : {
        type : String ,
        required: true 
    }
})

const blogModel = mongoose.model('blog', blogSchema)

module.exports = {
    blogModel: blogModel
}