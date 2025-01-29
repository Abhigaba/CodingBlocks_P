const mongoose = require('mongoose')


const cartSchema = new mongoose.Schema({

    product_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true, 
    }, 

    name : {
        type : String, 
        required: true, 
    },
    imageUrl : {
        type: String, 
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
    }

})

const cart = mongoose.model('cart', cartSchema); 

module.exports = {
    cart
}