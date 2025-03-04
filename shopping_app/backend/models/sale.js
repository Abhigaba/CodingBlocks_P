const mongoose = require('mongoose')

const saleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 6,
    },
    start: {
        type : Date , 
        required: true,
    },

    end : { 
        type : Date , 
        required: true,
        validate : {
            validator : function() {
                return this.start < this.end
            }
        }
    }
}, {
    timestamps: true 
})

const sale = mongoose.model('sale', saleSchema)
module.exports = {
    sale
}