const express = require('express'); 
const {authorModel} = require('../model/author')
const authorRouter = express.Router()
const {blogModel} =  require('../model/blog')

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

authorRouter.get('/fetch/:id', async (req, res) => {
    
    try {
    const blogs = await authorModel.findOne({_id: req.params.id})
    res.json({
        message: 'author fetched succesfully',
        data : blogs
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
        const id = req.params.id;
        console.log()
        await authorModel.findByIdAndUpdate(id, body, {runValidators: true}); 

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
        await blogModel.deleteMany({author: id});
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