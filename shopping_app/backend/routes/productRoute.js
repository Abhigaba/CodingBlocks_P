const express = require('express');
const {authMiddle} = require('../middleware/authMiddleware');
const {product} = require('../models/product');
const {wishList} = require('../models/wishlist');
const {sale} = require('../models/sale')
const nodemailer = require("nodemailer")
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
            
            const saleExists = await sale.find({}) 
            let ifSale = false ;

            if(saleExists.start >= Date.now() || saleExists.end < Date.now()){
                ifSale = true ; 
            }
            
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
                },
                ifSale : ifSale 
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
        
        const {name , 
            brand, 
            price, 
            discount, 
            imageUrl , 
            in_stock, 
            on_sale ,
            sale_discount} = req.body

        const ifExists = await product.findOne({owner_id : req.user._id, name : name}) ;
        if(ifExists) { 
            return res.status(400).json({message : 'Product already exists'}) ;
        }

        if (on_sale && sale_discount < discount) { 
            return res.status(400).json({message : 'Sale discount cannot be less than normal discount'}) ;
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

productRouter.patch('/update/stock/:id', authMiddle, async(req, res) => {

    try {

        if (req.user.isAdmin !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const isStock = req.query.in_stock;
        
        const selectedProduct = await product.findOne({_id: req.params.id}).populate('owner_id', '_id');
       
        if (selectedProduct.owner_id._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to update this product' });
        }
    
        if (selectedProduct.in_stock === isStock && isStock === 'true') {
            return res.status(400).json({ message: 'Product already in stock' });
        }

        if (selectedProduct.in_stock === isStock && isStock === 'false') {
            return res.status(400).json({ message: 'Product already out of stock' });
        }

        

        selectedProduct.in_stock = isStock;
        await selectedProduct.save();
        if (isStock === 'true') {
        const wishlistUsers = await wishList.find({product_id : req.params.id}).select('user_id').populate('user_id', 'email')
        
        if (wishlistUsers.length > 0) {
            const transporter = nodemailer.createTransport({    
                service: 'Gmail',
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                  user: 'abhigaba300@gmail.com',
                  pass: 'xxqa qrrv tcqi nnjr'
                }
              });

            wishlistUsers.forEach(async (user) => {

                const mailOptions = {
                    from: '"SoleStyle" <abhigaba300@gmail.com>',
                    to: 'gabaabi2445@gmail.com',
                    subject: '🎉 Your Wishlist Item is Back in Stock!',
                    html: `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <style>
                                body { font-family: Arial, sans-serif; line-height: 1.6; }
                                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                                .logo { text-align: center; margin-bottom: 20px; }
                                .header { background-color: #4F46E5; color: white; padding: 20px; border-radius: 8px; }
                                .content { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
                                .button { 
                                    background-color: #4F46E5; 
                                    color: white; 
                                    padding: 12px 24px; 
                                    text-decoration: none; 
                                    border-radius: 4px; 
                                    display: inline-block; 
                                    margin: 20px 0;
                                }
                                .footer { text-align: center; color: #666; font-size: 12px; }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <div class="logo">
                                    <svg viewBox="0 0 100 100" style="height: 50px; width: 50px;">
                                        <path d="M20,80 Q30,95 50,80 Q70,95 80,80 Q90,65 80,50 Q70,35 50,50 Q30,35 20,50 Q10,65 20,80" fill="#4F46E5"/>
                                        <path d="M30,70 Q50,85 70,70" fill="none" stroke="#fff" stroke-width="2"/>
                                    </svg>
                                    <h1 style="color: #4F46E5; margin: 10px 0;">SoleStyle</h1>
                                </div>
                                <div class="header">
                                    <h2>Great News! 🎉</h2>
                                </div>
                                <div class="content">
                                    <h3>Your Wishlist Item is Back!</h3>
                                    <p>Hey there,</p>
                                    <p>We're excited to let you know that <strong>${selectedProduct.name}</strong> is back in stock!</p>
                                    <p>Product Details:</p>
                                    <ul>
                                        <li>Name: ${selectedProduct.name}</li>
                                        <li>Brand: ${selectedProduct.brand}</li>
                                        <li>Price: $${selectedProduct.price}</li>
                                    </ul>
                                    <a href="${process.env.FRONTEND_URL}/product/${selectedProduct._id}" class="button">
                                        Shop Now
                                    </a>
                                    <p><small>Hurry! Popular items sell out quickly.</small></p>
                                </div>
                                <div class="footer">
                                    <p>© ${new Date().getFullYear()} SoleStyle. All rights reserved.</p>
                                    <p>You received this email because you added this item to your wishlist.</p>
                                </div>
                            </div>
                        </body>
                        </html>
                    `,
                    text: `Your Wishlist Item ${selectedProduct.name} is Back in Stock! Visit our website to shop now.`
                };

              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.error("Error sending email: ", error);
                } else {
                  console.log("Email sent: ", info.response);
                }
              });
            }

            )
        };}
        return res.json({message: 'Product stock updated successfully'});
    }
    catch(error) { 
        res.status(401).json({message: error.message})
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