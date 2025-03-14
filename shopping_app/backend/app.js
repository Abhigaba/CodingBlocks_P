const express = require('express') 
const {connectdb} = require('./utils/database');
const {authRouter} = require('./routes/authRoute')
const {cartRouter} = require('./routes/cartRoute')
const {productRouter} = require('./routes/productRoute')
const {reviewRouter} = require('./routes/reviewRoute')
const {orderRouter} = require('./routes/orderRoute')
const {coupenRouter} = require('./routes/coupenRoute')
const {wishRouter} = require('./routes/wishlishRoute');
const {saleRouter} =  require('./routes/saleRoute')
const {messageRouter} = require('./routes/chatSupportRoute')
const Chat = require("./models/message");

const  {Server} = require('socket.io')
const http = require("http");



const cookieParser = require('cookie-parser')
const cors = require('cors')

const app = express();
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = ["http://localhost:3000", "http://localhost:3001"];

app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use('/auth', authRouter);
app.use('/cart', cartRouter);
app.use('/product', productRouter);
app.use('/review', reviewRouter);
app.use('/order', orderRouter);
app.use('/coupen', coupenRouter);
app.use('/wishlist', wishRouter);
app.use('/sale', saleRouter);
app.use('/message', messageRouter);


io.on('connection' , (socket) => {
    console.log('User connected', socket.id); 

    socket.on("joinChat", (chatId) => {
      
      socket.join(chatId);
      console.log(`User joined the chat room : ${chatId}` ) 
    }) ; 

    socket.on("sendMessage", async ({ chatId, sender, text }) => {
      try {
        

        const chat = await Chat.findById(chatId);
        if (!chat) return;

        console.log(sender)
        chat.messages.push({ sender, text });
        await chat.save();
  

        io.to(chatId).emit("receiveMessage", { sender, text });
      } catch (error) {
          io.to(chatId.emit("Message failed to send"));
      }
    });
  
    socket.on("disconnect", () => {
      
      console.log("User disconnected");
    });
  
})



connectdb()
    .then(() => {
        server.listen('3000', () => {
            console.log('Connected to port', 3000)
        })
})
    .catch((error) => {
        console.log(error)
})