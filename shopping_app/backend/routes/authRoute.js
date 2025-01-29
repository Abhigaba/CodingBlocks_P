const express = require('express') 
const {suser} = require()
const {signUp, validatePassword} = require('../helper/authHelper')


const authRouter = express.Router() 

authrouter.post('/signup', async (req, res) => {

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


authrouter.post('/login',async (req, res) => {

    try { 

        const {email, password} = req.body
        const findUser = await suser.findOne({email}) ; 

        if (!findUser) {throw new Error('Invalid Credentials')}

        const token = await validatePassword(findUser, password)   
        
        res.cookie('token',token, {expires: new Date(Date.now() + 8*3600000) })
        res.send('Login successful');
    }
    catch(error) {
        res.status(401).send('Invalid Credentials');
    }
})


authrouter.get('/logout', (req, res) => {
    res.cookie('token', null, {expires: new Date(Date.now())})
    res.json({
        message: "Logout Successful"
    })
})

module.exports = {authRouter}