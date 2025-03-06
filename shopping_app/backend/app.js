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

const cookieParser = require('cookie-parser')
const cors = require('cors')
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = ["http://localhost:3000", "http://localhost:3001"];

app.use(cors({
  origin: 'http://localhost:3001',
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

connectdb()
    .then(() => {
        app.listen('3000', () => {
            console.log('Connected to port', 3000)
        })
})
    .catch((error) => {
        console.log(error)
})