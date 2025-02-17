const express = require('express') 
const {connectdb} = require('./utils/database');
const {blogRouter} = require('./routes/blogroute')
const {authorRouter} = require('./routes/authorRoute')
const cors = require('cors');



const app = express();

app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/blog', blogRouter);
app.use('/author', authorRouter);


connectdb()
    .then(() => {
        app.listen('3000', () => {
            console.log('Connected to port', 3000)
        })
})
    .catch((error) => {
        console.log(error)
    })

