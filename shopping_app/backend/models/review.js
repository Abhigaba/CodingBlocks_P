const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({

    product_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true, 
    }, 

    viewer_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'suser',
        required: true, 
    },

    price : {
        type: Number ,
        required: true ,
    },
    
    quantity : {
        type: Number , 
        min: 1 ,
        required: true
    },
    
    status : {
        type : String,
        default: "placed",
        enum: {
            values: ['shipped', 'deleivered'],
            message: '{VALUE} is not supported',
        }
    }
},   {
    timestamps: true
}
)

const review = mongoose.model('review', reviewSchema); 

module.exports = {
    review
}