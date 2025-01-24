const express = require('express'); 
const {authorModel} = require('../model/author')
const authorRouter = express.Router()

authorRouter.get('/fetch', async (req, res) => {
    
    try {
    const author = await authorModel.find({})
    res.json({
        message: 'author fetched succesfully',
        data : author
    })
    }
    catch(error) {
        res.status(500).send("Internal Server error")
    }
})

authorRouter.post('/add', async (req, res) => {

    try {
        console.log('add')
        const body = req.body; 
        
        const newAuthor =  new authorModel(body);
        await newAuthor.save();

        res.json({
            message: 'New author successfully added',
            data : newAuthor
        })
        
    }
    catch(error) {
        res.status(400).send(error.message)
    }
})

authorRouter.patch('/update/:id', async (req, res) => {

    try {
        const body = req.body ; 
        const id = req.params.id
        await authorModel.findByIdAndUpdate(id, body); 

        res.json({
            message: 'Author saved successfully'
        })
        
    }
    catch(error) {
        res.status(400).send(error.message)
    }
})

authorRouter.delete('/delete/:id', async (req, res) => {
    try {

        const id = req.params.id
        await authorModel.findByIdAndDelete(id); 

        res.json({
            message: 'Author Deleted successfully'
        })
        
    }
    catch(error) {
        res.status(400).send(error.message)
    }

})

module.exports = {
    authorRouter
}