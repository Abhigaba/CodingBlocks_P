const passport = require('passport');
const {puser} = require("../model/user")
const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local')

passport.use(new LocalStrategy(
    async function (username, password, done) {

        try {
        const user = await puser.findOne({username})
        
        
        const ifPass = await bcrypt.compare(password, user.password)
        if (!user) {return done(null, false)}
        if(!ifPass) { return done(null, false)}
        return done(null, user)}
    
        catch(error) {
            return done(error)
        }
    }
))

passport.serializeUser((user, done) => {
    console.log(user)
    done(null, user._id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
        console.log(id)
      const user = await puser.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
module.exports = {
    Mypassport: passport
}