const express = require('express') 
const {Mypassport} = require('../util/passport')
const authRouter = express.Router()
const {puser} = require('../model/user')
const bcrypt = require('bcrypt')

authRouter.post('/login', (req, res, next) => {
    Mypassport.authenticate('local', (err, user, info) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      if (!user) {
        return res.status(401).json({ message: "Authentication failed" });
      }
      
      req.login(user, (loginErr) => {
        if (loginErr) {
          return next(loginErr);
        }
        return res.json({ message: "Login successful" });
      });
    })(req, res, next);
  });


authRouter.post('/signup', async (req, res) => {

    try { 

        const {username, password} = req.body

        const hashed = await bcrypt.hash(password, 10)
        const user = new puser({username: username, password: hashed});
        console.log(user);
        req.session.username = username;
        req.session.password = hashed;
        await user.save()
        res.json({
            message: 'user successfully signed up',
            data: user
        })

    }   
    catch(error)  { 
      console.log(error.message)
        res.status(400).send(error.message); 
    }
})

authRouter.get('/logout', async (req, res, next) => {
    
    req.logout(function(error) {
        return next(error)
    })
    res.json({
        message: "Logout succesfull"
    })
})
module.exports = {
    authRouter
}