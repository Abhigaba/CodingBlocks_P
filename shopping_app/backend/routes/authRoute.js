const express = require('express') 
const {suser} = require('../models/user')
const {signUp, validatePassword} = require('../helper/authHelper')


const authRouter = express.Router() 

authRouter.post('/signup', async (req, res) => {

    try{
        const hashedPassword = await signUp(req.body.password);
        const user =  new suser({...req.body, password: hashedPassword});

        await user.save();
        res.send('Sign up successful')
        }
    catch(error) {
        res.status(401).send(error.message);
    }
})

authRouter.post('/login',async (req, res) => {

    try { 

        const {email, password} = req.body
        const findUser = await suser.findOne({email}) ; 

        if (!findUser) {throw new Error('Invalid Credentials')}

        const token = await validatePassword(findUser, password)   
        
        res.cookie("token", token, {
            sameSite: "none",
            secure: true,
            path: '/',
             
            expires: new Date(Date.now() + 8 * 3600000), 
          });   
        const isAdmin = findUser.isAdmin
        res.json({
            message: 'Login successful',
            data: {email: findUser.email, name : findUser.name, user_id : findUser._id, isAdmin: isAdmin}
        }
        )
        ;
    }
    catch(error) {
        res.status(401).send('Invalid Credentials');
    }
})


authRouter.get('/logout', async (req, res) => {
    
        res.cookie('token', null, {expires: new Date(Date.now()) })
        res.json({
        message: "Logout Successful"
    })
})

module.exports = {authRouter : authRouter}