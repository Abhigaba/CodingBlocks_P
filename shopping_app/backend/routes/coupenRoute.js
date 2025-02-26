const express = require('express');
const {product} = require('../models/product');
const router = express.Router();
const {coupen} = require('../models/coupen');
const {authMiddle} = require('../middleware/authMiddleware');
const checkEleigibility = require('../helper/coupenHelper');

router.post('/:id', authMiddle, async (req, res) => {

    try {

        const coupenData = await coupen.findById(req.params.id);
        
        if(!coupenData) {
            res.status(401).json({message: 'Coupen not found'});
        }

        if (coupenData.usageCount >= coupenData.maxUsage) {
            res.status(401).json({message: 'Coupen has reached max usage limit'});
        }

        if (!coupenData.isActive) {
            res.status(401).json({message: 'Coupen is not active'});
        }

        if (coupenData.validTo < Date.now()) {
            res.status(401).json({message: 'Coupen is not valid'});
        }


        const cartProducts = req.body.products; 

        if (!cartProducts || !Array.isArray(cartProducts) || cartProducts.length === 0) {
            return res.status(400).json({message: 'Cart is empty'});
        }

        let totalAmount = 0;
        let discountedAmount = 0;
        const discountedProducts = [];

        const productIds = cartProducts.map(item => item.product_id);
        const products = await product.find({ _id: { $in: productIds } });

       
        for (const cartItem of cartProducts) {
            const productDetail = products.find(p => p._id.toString() === cartItem.productId);
            
            if (!productDetail) {
                return res.status(400).json({message: `Invalid product in cart: ${cartItem.productId}`});
            }

            const itemTotal = productDetail.price * cartItem.quantity;
            totalAmount += itemTotal;

            const isEligible = checkEleigibility(coupenData, productDetail);
            if (isEligible) {
                let discountAmount = 0;
                if (coupenData.discountType === 'percentage') {
                    discountAmount = (itemTotal * coupenData.discountValue) / 100;
                } else {
                    discountAmount = coupenData.discountValue;
                }

                discountedProducts.push({
                    productId: cartItem.productId,
                    originalPrice: itemTotal,
                    discountedPrice: itemTotal - discountAmount,
                    discountApplied: discountAmount
                });

                discountedAmount += discountAmount;
            } else {
                discountedProducts.push({
                    productId: cartItem.productId,
                    originalPrice: itemTotal,
                    discountedPrice: itemTotal,
                    discountApplied: 0
                });
            }
        }

        if (totalAmount < coupenData.minPuchaseAmount) {
            return res.status(400).json({
                message: `Minimum purchase amount of ${coupenData.minPuchaseAmount} required`
            });
        }

        res.json({
            totalAmount,
            discountedAmount,
        });

    } catch (error) {
        res.status(500).json({ message: 'Error fetching coupen', error: error.message });
    }
})

router.post('/add', authMiddle, async (req, res) => {
    try {
        const coupenData = req.body;

        const  owner = req.user._id;

        const {
            name,
            discountType,
            discountValue,
            minPurchaseAmount,
            validFrom,
            validTo,
            applicableBrand,
            is_All_Brand,
            maxUsage,
        } = req.body;
        
        const data = {
            name,
            discountType,
            discountValue,
            minPurchaseAmount,
            validFrom,
            validTo,
            applicableBrand,
            is_All_Brand,
            maxUsage
        }
        
        
        if (is_All_Brand) { 
            const newCoupen = new coupen({ owner_id : owner, ...data});                
            await newCoupen.save(); 

            res.json({message: 'Coupen added successfully'});
        }
        else {
            const {products} = req.body;
            if (!products || !Array.isArray(products) || products.length === 0) {
                return res.status(400).json({message: 'Products are required for brand specific coupen'});
            }
            
            const pid = products.map(p => p.product_id);
            const exists = await product.find({ _id: { $in: pid} });
            
            if (exists.length !== products.length) {
                return res.status(400).json({message: 'Invalid product in products list'});
            }

            products.forEach(async (p) => {
                if (p.brand !== applicableBrand) {
                    return res.status(400).json({message: 'Invalid brand in products list'});
                }

                if (p.owner_id !== owner) {
                    return res.status(400).json({message: 'Invalid owner in products list'});
                }

            });


            const CHUNK_SIZE = 100;
            const productChunks = [];
            
            for (let i = 0; i < products.length; i += CHUNK_SIZE) {
                const chunk = products.slice(i, i + CHUNK_SIZE);
                productChunks.push({
                    chunkId: Math.floor(i / CHUNK_SIZE) + 1,
                    products: chunk
                });
            }

            const newCoupon = new coupen({owner_id: owner , productChunks: productChunks, ...data});
            await newCoupon.save();
            res.json({ message: 'Coupon added successfully'});
        }

    } catch (error) {
        res.status(500).json({ message: 'Error adding coupen', error: error.message });
    }
})


router.delete('/delete/:id', authMiddle, async (req, res) => {
    try {
        const coupenData = await coupen.findById(req.params.id);
        
        if (!coupenData) {
            return res.status(400).json({message: 'Coupen not found'});
        }

        if (coupenData.owner_id.toString() !== req.user._id.toString()) {
            return res.status(401).json({message: 'Not authorized to delete this coupen'});
        }

        await coupen.findByIdAndDelete(req.params.id);
        res.json({message: 'Coupen deleted successfully'});

    } catch (error) {
        res.status(500).json({ message: 'Error deleting coupen', error: error.message });
    }
})
