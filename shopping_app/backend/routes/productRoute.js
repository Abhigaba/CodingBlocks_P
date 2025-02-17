const express = require('express');
const {authMiddle} = require('../middleware/authMiddleware');
const {product} = require('../models/product');
const productRouter = express.Router(); 

productRouter.get('/fetch', async (req, res) =>{
    
    try {
            const page = parseInt(req.query.page) || 1;  
            const limit = parseInt(req.query.limit) || 10;  
            const skip = (page - 1) * limit;

            const totalProducts = await product.countDocuments();

            
            const products = await product.find({}).populate('owner_id', 'name')
                .skip(skip)
                .limit(limit);
            
            if (products.length == 0) {throw new Error('No products available') }

            res.json({
                message: 'Products fetched successfully',
                products,
                pagination: {
                    currentPage: page,
                    itemsPerPage: limit,
                    totalItems: totalProducts,
                    totalPages: Math.ceil(totalProducts / limit),
                    hasNextPage: skip + limit < totalProducts,
                    hasPrevPage: page > 1
                }
            });
        
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
})

productRouter.get('/admin/fetch/:id', authMiddle, async(req, res) => {
    
    try {
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Admin access required' });
    } 

    const products = await product.find({owner_id: req.params.id})

    res.json({
        message: "Products fetched successfully",
        data: products
    })}
    catch(error) {
        res.status(400).send(error.message);
    }
    
})

productRouter.post('/add',authMiddle, async  (req, res) => {
    try {

        if (!req.user.isAdmin) {
            return res.status(403).json({ message: 'Admin access required' });
        }


        const newProduct = new product({
            ...req.body, owner_id : req.user._id
        });

        const savedProduct = await newProduct.save();
        res.json({
            message: 'Product added successfully',
            
        });
    } catch (error) {
        res.status(500).json({ message: 'Error adding product', error: error.message });
    }
})

productRouter.patch('/update/:id', authMiddle, async (req, res) => {
    try {

        if (req.user.isAdmin !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const updatedProduct = await product.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
        ).select('-owner_id');

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({
            message: 'Product updated successfully', 
            product: updatedProduct
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
})

productRouter.delete('/delete/:id', authMiddle, async (req, res) =>{
    try {

        if (!req.user.isAdmin) {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const deletedProduct = await product.findByIdAndDelete(req.params.id);
        
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
})

module.exports = {productRouter}