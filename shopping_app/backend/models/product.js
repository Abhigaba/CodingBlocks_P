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
        min: 0,
        default: 0,
        max: 90,
    },

    description : {
        type :String ,
        minLength : 10,
        required: true,
    },
    imageUrl : {
        type : String ,
        required : true ,
    },
    in_stock:  { 
        type : Boolean,
        required: true,
        default: true
    },
    on_sale: {
        type: Boolean,
        required: true,
        default: true,
    },
    sale_discount: {
        type: Number,
        min: 30,
        default : 30,
    }

},   {
    timestamps: true
})

const product = mongoose.model('product', productSchema); 

module.exports = {
    product
}