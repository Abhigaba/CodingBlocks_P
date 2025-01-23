const connectdb = require ( './utils/database');
const  {addRouter} = require('./routes/addroute');
const  deleteRouter = require( './routes/deleteroute');
const priorityRouter = require('./routes/priority');
const fetchRouter  = require('./routes/fetchroute');
const express = require('express') ;
const path = require('path')
const app = express() 
app.use(express.json())
app.use(express.static(path.join(__dirname, 'static')))

console.log(addRouter)
app.use('/add', addRouter);
app.use('/delete', deleteRouter.deleteRouter);
app.use('/priority', priorityRouter.priorityRouter);
app.use('/fetch', fetchRouter.fetchRouter);

connectdb.connectdb().then(() => {
    app.listen(3000, () => {
        console.log("Listening to port: ", 3000)})
}).
catch((error) => {
    console.log(error)
})