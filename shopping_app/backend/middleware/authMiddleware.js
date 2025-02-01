const {suser} = require('../models/user')
const  jwt = require('jsonwebtoken')

const authMiddle = async (req, res, next) => { 

    try { 

        const {token} = req.cookies;
        if (!token) { 
            throw new Error('Token expired');
        }

        const decoded = await jwt.verify(token, 'shhhhh') 

        const user = await suser.findById(decoded); 
        if (!user) { 
            throw new Error('Session Expired');
        }
        req.user = user ;
        next();
    }
    catch(error) {
        res.status(400).send(error)
    }

}

module.exports = {authMiddle}