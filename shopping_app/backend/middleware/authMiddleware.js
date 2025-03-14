const {suser} = require('../models/user')
const  jwt = require('jsonwebtoken')

const authMiddle = async (req, res, next) => { 

    try { 

        const {token} = req.cookies;
        
        if (!token) { 
            return res.status(401).json({message: 'Token expired'});
        }

        const decoded = jwt.verify(token, 'shhhhh') 

        const user = await suser.findById(decoded); 
        if (!user) { 
            return res.status(400).send('Token expired');
        }
        req.user = user ;
        next();
    }
    catch(error) {
        res.json({message: error.message})
    }

}

module.exports = {authMiddle}