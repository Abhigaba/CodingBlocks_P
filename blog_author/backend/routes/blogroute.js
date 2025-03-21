const express = require('express'); 
const {blogModel} = require('../model/blog')
const {authorModel} = require('../model/author')
const blogRouter = express.Router()

blogRouter.get('/fetch', async (req, res) => {
    
    try {
    const blogs = await blogModel.find({}).populate('author', 'name imageUrl')
    res.json({
        message: 'blogs fetched succesfully',
        data : blogs
    })
    }
    catch(error) {
        res.status(500).send("Internal Server error")
    }
})

blogRouter.get('/fetch/:id', async (req, res) => {
    
    try {
    const blogs = await blogModel.findOne({_id: req.params.id}).populate('author', 'name')
    res.json({
        message: 'blogs fetched succesfully',
        data : blogs
    })
    }
    catch(error) {
        res.status(500).send("Internal Server error")
    }
})

blogRouter.post('/add', async (req, res) => {

    try {

        const {title, author , content} = req.body; 
        
        const authValid = await authorModel.findOne({_id :author})
        if (!authValid) {
            throw new Error('No author exists');
        }

        const newBlog =  new blogModel({title, author, content, });
        await newBlog.save();

        res.json({
            message: 'New blog successfully added',
            data : newBlog,
            author: authValid
        })
        
    }
    catch(error) {
        res.status(400).send(error.message)
    }
})

blogRouter.patch('/update/:id', async (req, res) => {

    try {
        const body = req.body ; 
        const id = req.params.id
        await blogModel.findByIdAndUpdate(id, body,{runValidators: true}); 

        res.json({
            message: 'User saved successfully'
        })
        
    }
    catch(error) {
        res.status(400).send(error.message)
    }
})

blogRouter.delete('/delete/:id', async (req, res) => {
    try {

        const id = req.params.id
        await blogModel.findByIdAndDelete(id); 

        res.json({
            message: 'User Deleted successfully'
        })
        
    }
    catch(error) {
        res.status(400).send(error.message)
    }

})

module.exports = {
    blogRouter: blogRouter
}