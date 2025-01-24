const express = require('express') 
const {connectdb} = require('./utils/database');
const {blogRouter} = require('./routes/blogroute')
const {authorRouter} = require('./routes/authorRoute')

const app = express();
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

