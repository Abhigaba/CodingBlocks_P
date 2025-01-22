const express = require('express') ;
const path = require('path')
const app = express() 

app.use(express.json())
app.use(express.static(path.join(__dirname, 'static')))

app.get('/calculate/:firstNumber/:secondNumber' , (req, res) => {
    
    const {firstNumber, secondNumber} = req.params ;

    const first = parseFloat(firstNumber);
    const second = parseFloat(secondNumber);
    res.json({
        product: first*second , 
        sum: first + second,
        diff: first - second,
     })
})


app.listen(3000, () => {
    console.log("Listening to port: ", 3000)
})