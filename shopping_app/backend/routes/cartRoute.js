const express = require('express');
const {authMiddle} = require('../middleware/authMiddleware')
const {cart} = require('../models/cart')

const cartRouter = express.Router()

cartRouter.get('/fetch', async (req, res) =>{

    try {
            {
            const products = await cart.find({})
            
            res.json({
                message: 'Products fetched successfully',
                products,
            });

        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart', error: error.message });
    }
})

cartRouter.post('/add',async  (req, res) => {
    try {

        const newProduct = new cart({
            ...req.body
        });

        await newProduct.save();
        res.json({
            message: 'Producr added successfully',
        });
    } catch (error) {
        res.status(500).json({ message: 'Error adding cart', error: error.message });
    }
})

cartRouter.patch('/update:id', authMiddle, async (req, res) => {
    try {

        if (!req.user.isAdmin) {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const updatedProduct = await cart.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
        )

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({
            message: 'Product updated successfully', 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating cart', error: error.message });
    }
})

cartRouter.delete('/delete/:id', authMiddle, async (req, res) =>{
    try {

        const deletedProduct = await cart.findByIdAndDelete(req.params.id);
        
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting cart', error: error.message });
    }
})

module.exports = {cartRouter}