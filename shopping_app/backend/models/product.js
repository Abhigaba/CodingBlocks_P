const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({

    name : {
        type : String, 
        required: true, 
        minLength: 6
    },

    brand: {
        type: String, 
        minLenght : 4,
        required: true
    },

    owner_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'suser',
        required: true, 
    },

    price : {
        type: Number ,
        required: true ,
        min: 1,
    },

    discount: {
        type : Number , 
    },

    description : {
        type :String ,
        minLength : 10,
        required: true,
    },

},   {
    timestamps: true
})

const product = mongoose.model('product', productSchema); 

module.exports = {
    product
}