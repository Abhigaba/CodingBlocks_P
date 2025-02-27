const mongoose = require('mongoose')

const coupenSchema  = new mongoose.Schema({

    owner_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'suser',
        required: true
    },
    name : {
        type : String ,
        required: true ,
        unique: true,
        uppercase: true,
        trim: true,
        minLength: 5,
        maxLength: 10
    },

    discountType : {
        type : String,
        enum : {
            values:    ['percentage', 'fixed'], 
            message: '{VALUE} is not a supported discount type'
        },
        required: true,
        trim: true,
        lowercase: true,
    },

    discountValue :{
        type: Number, 
        required: true,
        min: 5,
    },
    minPuchaseAmount : {
        type : Number ,
        default : 0 ,
        min: 0
    } ,
    validFrom : {
        type : Date,
        required: true ,
        index: true ,
        validate: {
            validator: function(v) {
                return v >= new Date();
            },
            message: 'Valid from date must be in the future'
        }
    },

    validTo : {
        type: Date ,
        required: true ,
        index : true,
        validate: {
            validator: function(v) {
                return v >= this.validFrom;
            },
            message: 'Valid to date must be greater than Valid from date'
        }
    },

    applicabelBrand : {
        type : String,
        enum: {
            values: ['Nike', 'Asics', 'Sketchers', 'H&M', 'Zara', 'Adidas', 'Red Tape'],
            message: '{VALUE} is not a supported brand'
        }, 
        required: true,
    }, 

    is_All_Brand: {
        type: Boolean,
        default: true,
        required: true
    },
    productChunks: [{
        _id: false,
        chunkId: Number,
        products: [{ 
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product'
        }]
      }],

    maxUsage: {
        type: Number,
        default: 1,
        min: 1 ,
        validate: {
            validator: function(v) {
                return v === null || v >= this.usageCount;
            },
            message: 'Max usage cannot be less than current usage count'
        }
      },

      usageCount: {
        type: Number,
        default: 0,
        min: 0
      },

      isActive: {
        type: Boolean,
        default: true,
        }
    },
    {
    timestamps : true
    }
)

const coupen = mongoose.model('coupen', coupenSchema);
module.exports = {
    coupen
}