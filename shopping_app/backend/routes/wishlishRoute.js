const express = require('express')
const {authMiddle} = require('../middleware/authMiddleware')
const {wishList} = require('../models/wishlist')
const {product} = require('../models/product')

const wishRouter = express.Router()


wishRouter.get('/', authMiddle, async(req, res) => {

    try {
        const user_id = req.user._id;

        const products = await wishList.find({user_id: user_id}).populate('product_id', 'product_id name brand price discount imageUrl');
    
        if (!products) {
            return res.status(401).json({message: "No products found"})
        }

        return res.json({
            message: "Products fetched successfully",
            data: products
        })

    }
    catch(error) {
        res.status(401).json({message: error.message})
    }
})

wishRouter.post('/add/:id', authMiddle, async (req, res) => {

    
    try {
        const user_id = req.user._id;
        const product_id = req.params.id;
        
        const productExists = await product.findOne({_id: product_id});
        if(!productExists) {
            return res.status(401).json({message: "Product does not exist"})}

        if (productExists.owner_id === user_id){
            return res.status(401).json({message: "You cannot add your own product to wishlist"})
        }

        await wishList.create({user_id, product_id});

        res.json({
            message: "Product added to wishlist"
        })
    }
    catch(error) {
        res.status(401).json({message: error.message})
    }
})
wishRouter.delete('/:id', authMiddle, async (req, res) => {

    try{

        const id = req.params.id ;
        wishList.findByIdAndDelete(id) ;
        
        res.json({
            message : "Product succcessfully deleted from wishlist"
        })
    }
    catch(error) {
        res.status(401).json({message: error.message})
    }
})

module.exports = {wishRouter}