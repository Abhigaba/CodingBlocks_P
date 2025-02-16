const express = require('express');
const {authMiddle} = require('../middleware/authMiddleware')
const {order} = require('../models/order')
const {product, product} = require('../models/product')

const orderRouter = express.Router() 

orderRouter.get('/fetch', authMiddle, async (req, res) => {

    try { 

        const buyer = req.user._id;
        const orders = await order.find({buyer_id: buyer})

        if (!order) { 
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

orderRouter.post('/place', authMiddle, async (req, res) => {

    try {


        const {product_id} = req.body ;
        const product = await product.findOne({_id: product_id}) 

        if (!product) {
            return res.status(404).json({message: 'Product not found'})
        }

        if(product.owner_id.toString() == req.user._id.toString()) {
            return res.status(400).json({message: 'You cannot buy your own product'})
        }

        const newOrder = new order({
            product_id: req.body.product_id,
            buyer_id: req.user._id,
            price: req.body.price,
            quantity: req.body.quantity,
        })

        await newOrder.save();
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

