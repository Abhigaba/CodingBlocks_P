const express = require('express');
const {authMiddle} = require('../middleware/authMiddleware')
const {cart} = require('../models/cart')
const {sale} = require('../models/sale')
const cartRouter = express.Router()

cartRouter.get('/fetch/:id', async (req, res) =>{

    try {
            {
            const products = await cart.find({user_id: req.params.id}).populate('product_id', 'name brand price discount imageUrl sale_discount on_sale').select('product_id, quantity _id')
            const saleExists = await sale.find({})

            let ifSale = false ; 
            
            if(saleExists[0].start <= Date.now() || saleExists[0].end > Date.now()){
                ifSale = true ;
            } 

            res.json({
                message: 'Products fetched successfully',
                data:{products: products, sale: ifSale},
            });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart', error: error.message });
    }
})

cartRouter.post('/add',async  (req, res) => {
    try {

        const newProduct = new cart({
            product_id: req.body.product_id ,
            user_id: req.body.user_id,
            quantity: req.body.quantity,
        });

        await newProduct.save();
        res.json({
            message: 'Product added successfully',
            data : {_id: newProduct._id , quantity: req.body.quantity},
        });

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: 'Error adding cart', error: error.message });
    }
})

cartRouter.patch('/update/:id', authMiddle, async (req, res) => {
    try {

        const updatedProduct = await cart.findByIdAndUpdate(
            req.params.id,
            {quantity: req.body.quantity},
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