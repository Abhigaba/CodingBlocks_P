const {authMiddle} = require('../middleware/authMiddleware')
const Chat = require('../models/message')
const {suser} = require('../models/user')
const express= require('express'); 


const messageRouter = express.Router();
const agents = ['care1' , 'care2' , 'care3' , 'care4']


messageRouter.get('/agent', authMiddle, async (req, res) => {

    try {

        const ChatIds = await Chat.find({agent: req.user.name});

        if (ChatIds.length === 0 ) { 
            return res.status(400).json({message : "No Chats Registererd"}) ;
        }

        return res.json({chats: ChatIds})
    }
    catch(error) { 
        res.status(401).json({message: error.message})
    }
})

messageRouter.get('/agent/:id', authMiddle, async (req, res) => {

    try {
        console.log(req.params.id)
        const ChatIds = await Chat.findOne({_id: req.params.id});
    
        
        return res.json({chats: ChatIds})
    }
    catch(error) { 
        res.status(401).json({message: error.message})
    }
})


messageRouter.get('/', authMiddle, async (req, res) => {

    try{

        const messages = await Chat.findOne({customer: req.user._id}).select('messages');
        
        if (messages.messages.length === 0) { 
            return res.json({messages: messages})
        }

        return res.json({   
            messages : messages
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
            console.log(ifRoom?.agent)
            if (!ifRoom){
                const startChat = new Chat({
                customer : user_id , 
                agent:  agent, 
            })

            await startChat.save();
            return res.json({data: startChat});
            }

            else{ 
                await Chat.updateOne({customer: req.user._id}, {agent: agent})
                return res.json({data: ifRoom})
            }
        }
    catch(error) {

        res.status(500).json({message : error.message})
    }
})

module.exports = {
    messageRouter
}