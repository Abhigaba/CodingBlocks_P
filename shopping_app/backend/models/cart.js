const mongoose = require('mongoose')


const cartSchema = new mongoose.Schema({

    product_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true, 
    }, 
    user_id : {
        type : mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'suser'
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