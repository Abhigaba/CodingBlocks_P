const {sale} = require('../models/sale')
const express = require('express')
const {authMiddle} = require('../middleware/authMiddleware')

const saleRouter = express.Router() 

saleRouter.post('/', authMiddle, async (req, res) => {

    try { 
        const exists = await sale.find({}) ;
        
        if (exists.length > 0  && exists[0].start < Date.now() && exists[0].end > Date.now()) {
            return res.status(400).json({message : "Sale already exists"}) ;
        }
        const {name, start, end} = req.body ; 


        if (start > end){ 
            return res.status(400).json({message : "Start date must be before end date"}) ;
        }

        console.log(exists[0].end < Date.now())
        if (exists.length > 0 && exists[0].end < Date.now()) {
                await sale.findOneAndUpdate({name : exists[0].name}, {name : name , start : start ,end : end}) ;               
        }
        else {
            
                const newSale = new sale({
                    name, start ,end 
            }) 

        await newSale.save();}
        res.json({
            message : "Sale created successfully",
        })
    }
    catch(error) {
        console.log(error.message)
        res.status(500).json({message : "Internal server error"});
    }
})

saleRouter.put('/update', authMiddle, async (req, res) => {

    try {
    const {name , start , end } = req.body ;

    if (start < Data.now()) { 
        res.status(400).json({message : "Start can not be less than today"}) ;
    } 

    const exists = sale.find({})

    if (exists[0].end > end ) { 
        res.status(400).json({message : "End can not be less than available"}) ;
    }

     
    }
    catch(error ) {
        res.status(500).json({message : "Internal Server error"});
    }
})
saleRouter.delete('/delete ', authMiddle, async (req, res) => {

    try { 
         await deleleMany({}) ;
         res.json({message : "Sale deleeted successfully"})
    }
    catch(error ){ 
        res.status(500).json({message : "Internal server error"}) ;
    }
});

module.exports = {
    saleRouter
}