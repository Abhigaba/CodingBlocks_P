const {authMiddle} = require('../middleware/authMiddleware')
const Chat = require('../models/message')
const {suser} = require('../models/user')
const express= require('express'); 


const messageRouter = express.Router();
const agents = ['care1' , 'care2' , 'care3' , 'care4']


messageRouter.get('/', authMiddle, async (req, res) => {

    try{

        const messages = await Chat.find({customer: req.user._id}).select('messages');
        
        if (messages.length === 0) { 
            return res.json({messages: []})
        }

        return res.json({
            message : messages
        })
    }
    catch(error) {
        res.status(500).json({message : error.message})
    }

})


messageRouter.post('/start', authMiddle, async (req, res) => {

    try {
            const user_id = req.user._id ; 
            const  agentIndex = Math.floor(Math.random()*agents.length)

            const agent = agents[agentIndex]

            const ifRoom = await Chat.findOne({customer: req.user._id})

            if (!ifRoom){
            const startChat = new Chat({
                customer : user_id , 
                agent:  agent, 
            })

            await startChat.save();
            return res.json({startChat});
            }

            else{ 
                ifRoom.agent = agent;
                await ifRoom.save();

                return res.json({ifRoom})
            }

    }
    catch(error) {
        res.status(500).json({message : error.message})
    }
})

module.exports = {
    messageRouter
}