const { product } = require("./product")

const mongoose = require('mongoose')

const wishListSchema = new mongoose.Schema({
    user_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'suser'
    },

    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
    }
})

const wishList = mongoose.model('wishList', wishListSchema)
module.exports = {
    wishList
}