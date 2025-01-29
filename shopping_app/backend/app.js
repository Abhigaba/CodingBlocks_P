const express = require('express') 
const {connectdb} = require('./utils/database');
const {authRouter} = require('./routes/authRoute')
const {cartRouter} = require('./routes/cartRoute')
const {productRouter} = require('./routes/productRoute')
const {reviewRouter} = require('./routes/reviewRoute')
const cookieParser = require('cookie-parser')

const app = express();


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRouter);
app.use('/cart', cartRouter);
app.use('/product', productRouter);
app.use('/review', reviewRouter)

connectdb()
    .then(() => {
        app.listen('3000', () => {
            console.log('Connected to port', 3000)
        })
})
    .catch((error) => {
        console.log(error)
})