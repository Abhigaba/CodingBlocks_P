const express = require('express') 
const {connectdb} = require('./util/database');
const {authRouter} = require('./routes/auth')
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const cors = require('cors')

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

app.use(require('express-session')({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://abhi:Abhi33624512@projects.cxdmr.mongodb.net/?retryWrites=true&w=majority&appName=Projects'
    })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter);

connectdb()
    .then(() => {
        app.listen('3000', () => {
            console.log('Connected to port', 3000)
        })
})
    .catch((error) => {
        console.log(error)
    })

