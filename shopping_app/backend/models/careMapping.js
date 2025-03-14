const mongoose = require('mongoose'); 

const mappingSchema = new mongoose.Schema({
    
    user_id  : {
        type : mongoose.Schema.Types.ObjectId,
        required : true , 
        ref: 'suser', 
    },

    care_id : {
        type : mongoose.Schema.Types.ObjectId,
        required : true , 
        ref : 'suser'
    }, 

    status : {
        type : String, 
        default: 'online',
        enum : {
            values: ['online', 'offline'],
            message: '{VALUE} is not supported',
        },
    }
}, 
    {
        timestamps : true
    }
    )

const mapping = mongoose.model('careMapping', mappingSchema); 

module.exports = {
    mapping
}