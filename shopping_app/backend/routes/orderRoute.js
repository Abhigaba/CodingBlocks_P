const express = require('express');
const {authMiddle} = require('../middleware/authMiddleware')
const {order} = require('../models/order')
const {product} = require('../models/product')
const {cart} = require('../models/cart')
const Razorpay = require('razorpay');
const crypto = require('crypto');

let instance = new Razorpay({
  key_id: 'rzp_test_FtKoc7w9GQn3tR',
  key_secret: 'ZdRgPPMlKzlG3tpMwSxG3pdf',
});

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

        const products = req.body.products;
        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: 'Please provide valid products array' });
        }

        const foundProducts = await product.find({
            _id: { $in: products.map(p => p.productId) }
        });
   
        if (foundProducts.length !== products.length) {
            return res.status(400).json({ message: 'Please provide valid products' });
        }
        const ifApplicable = products.filter((item) => item.quantity <= 0);

        if (ifApplicable.length > 0) {
            return res.status(400).json({ message: 'Please provide valid quantity' });
        }
        const ownedProducts = foundProducts.filter((item) => item.owner_id.toString() === req.user._id.toString());
        
        if (ownedProducts.length > 0) {
            return res.status(400).json({ message: 'Cannot order owned Products' });   
        }

        console.log(req.body.amount)
        let options = {
            amount: req.body.amount,  // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            currency: "INR",
            receipt: "order_rcptid_11"
          };
        
          instance.orders.create(options, function(err, order) {
            if (err) {
                console.log(err) 
                res.status(500).json({message: 'Error placing order', error: err.message});
            }
            else {
            res.json({order , key : 'rzp_test_FtKoc7w9GQn3tR'})}
          });
    }
    catch(error) {
        res.status(500).json({message: 'Error placing order', error: error.message})
    }
})


orderRouter.post('/verify-payment', authMiddle, async (req, res) => {

    try {
    
        const { 
            razorpayOrderId, 
            razorpayPaymentId, 
            razorpaySignature, 
            orderDetails 
          } = req.body;

          const generatedSignature = crypto
          .createHmac('sha256', 'ZdRgPPMlKzlG3tpMwSxG3pdf')
          .update(`${razorpayOrderId}|${razorpayPaymentId}`)
          .digest('hex');
    
        if (generatedSignature !== razorpaySignature) {
          return res.status(400).json({
            success: false,
            message: 'Invalid payment signature'
          });
        }    

        console.log('Payment verified')
        const orderPromises = orderDetails.items.map((item) => {
            const newOrder = new order({product_id: item.product_id, 
                price: item.price,  
                quantity: item.quantity,
                buyer_id : req.user._id})
            return newOrder.save()
        })

        
        
        await Promise.all(orderPromises)
        await cart.deleteMany({user_id: req.user._id})
        
        res.json({
            message: 'Order placed successfully',
            success: true,
        })
    }
    catch(error) {
        console.log(error.message)
        res.status(500).json({message: 'Internal server error'})
    }
})
module.exports = {
    orderRouter 
}

