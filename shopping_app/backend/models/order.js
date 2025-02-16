const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({

    product_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true, 
    }, 

    buyer_id : {
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

const order = mongoose.model('order', orderSchema); 

module.exports = {
    order
}