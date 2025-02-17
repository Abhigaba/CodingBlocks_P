const express = require('express');
const {authMiddle} = require('../middleware/authMiddleware')
const {order} = require('../models/order')
const {product} = require('../models/product')

const orderRouter = express.Router() 

orderRouter.get('/fetch', authMiddle, async (req, res) => {

    try { 

        const buyer = req.user._id;
        const orders = await order.find({buyer_id: buyer}).populate('product_id', 'name brand imageUrl').select('product_id, price quantity status'); 

        if (!orders) { 
            return res.status(404).json({message: 'No orders found'})
        }

        res.json({
            message: 'Orders fetched successfully',
            data: orders,
        })
    }
    catch(error) { 
        res.status(500).json({message: 'Error fetching orders', error: error.message})
    }
})

orderRouter.get('/fetch/admin', authMiddle, async(req, res) => {
    
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({message: 'Admin access required'})
        }
        
        const orders = await order.find({owner_id: req.user._id}).populate('product_id', 'name brand').select('product_id price quantity status buyer_id');
        return res.json({
            message: 'Orders fetched successfully',
            data: orders,
        })
    }
    catch(error) {
        res.status(500).json({message: 'Error fetching orders', error: error.message})
    }
})

orderRouter.put('/update/:id', authMiddle, async (req, res) => {

    try { 
        if (req.user.role !== 'admin') { 
            res.status(403).json({message: 'Cannot change order'}) 
        }

        const order_id = req.params.id;
        const body = req.body; 

        const notReuired = ['product_id', 'owner_id', 'buyer_id', 'price', 'quantity'];
        const isValid = Object.keys(body).every(key => notReuired.includes(key));

        if (isValid) {
            return res.status(400).json({message: 'Invalid request'})
        }

        await order.findByIdAndUpdate(order_id, {$set: req.body});

        return res.json({
            message: 'Status successfully updated'
        })
    }
    catch(error) { 
        res.status(500).json({message: 'Error updating order', error: error.message})
    }
})

orderRouter.post('/place', authMiddle, async (req, res) => {

    try {
        const products = req.body ;
      
        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: 'Please provide valid products array' });
        }

        const foundProducts = await product.find({
            _id: { $in: products.map(p => p.product_id) }
        });

        if (foundProducts.length !== products.length) {
            return res.status(400).json({ message: 'Please provide valid products' });
        }

        const ownedProducts = foundProducts.filter((item) => item.owner_id.toString() === req.user._id.toString());
        
        if (ownedProducts.length > 0) {
            return res.status(400).json({ message: 'Cannot order owned Products' });   
        }

        const orderPromises = products.map((item) => {
            const newOrder = new order({...item, buyer_id : req.user._id})
            return newOrder.save()
        })
        
        await Promise.all(orderPromises)
        
        res.json({
            message: 'Order placed successfully',
        })

    }
    catch(error) {
        res.status(500).json({message: 'Error placing order', error: error.message})
    }
})

module.exports = {
    orderRouter 
}

