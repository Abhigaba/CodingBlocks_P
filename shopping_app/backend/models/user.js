const mongoose = require('mongoose')  

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        minLength: 3
    },
    email : {
        type : String, 
        required : true ,
        unique: true 
    }, 
    password: {
        type : String, 
        required: true ,
        minLength: 8 ,
    },
    isAdmin: {
        type: String,
        default: "client",
        enum: {
            values: ['client', 'admin'],
            message: '{VALUE} is not supported',
        }
    }

},  {
    timestamps: true
})

const suser = mongoose.model('suser', userSchema)
module.exports = {
    suser
}