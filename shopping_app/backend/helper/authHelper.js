const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const  signUp = async (password) => {

    try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return   hashedPassword;}

    catch (error) { 
        throw new Error('Unknown error occured');
    }
}

const validatePassword = async (findUser, password) => { 

    try { 
        const correctPass = await bcrypt.compare(password,findUser.password);
        if (!correctPass) {throw new Error('Invalid Credentials')}
        const token = await jwt.sign({ _id: findUser._id },'shhhhh',{expiresIn: '7h'});
        return token
    }
    catch(error) { 
        throw new Error('Invalid Credentials' );
    }
}
module.exports = {
    signUp, validatePassword
}