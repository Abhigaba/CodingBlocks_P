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
    rating: {
        type: Number,
        required: true,
    },

    description : {
        type : String ,
        required: true ,
        minLength : 4,
    }

},   {
    timestamps: true
}
)

const review = mongoose.model('review', reviewSchema); 

module.exports = {
    review
}