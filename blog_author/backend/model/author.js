const mongoose = require('mongoose'); 

const authorSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    imageUrl :{
        type: String,
        default: 'https://www.google.com/imgres?q=default%20user%20profile&imgurl=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2Fb%2Fb5%2FWindows_10_Default_Profile_Picture.svg%2F1200px-Windows_10_Default_Profile_Picture.svg.png&imgrefurl=https%3A%2F%2Fcommons.wikimedia.org%2Fwiki%2FFile%3AWindows_10_Default_Profile_Picture.svg&docid=TWw_ZbzCAPjPMM&tbnid=Tk2ePTUQ_-sbiM&vet=12ahUKEwiR9r3z-o6LAxUQR2wGHUadExwQM3oECBoQAA..i&w=1200&h=1200&hcb=2&ved=2ahUKEwiR9r3z-o6LAxUQR2wGHUadExwQM3oECBoQAA'
        
    },
    age: {
        type: Number,
        min: 10
    }
})

const authorModel = mongoose.model('author', authorSchema)

module.exports = {
    authorModel: authorModel
}