const express = require('express');
const mongoose = require('mongoose')
require('dotenv').config()
// import routes

const userRoute = require('./routes/user')

//App

const app = express();

//db
mongoose.connect(process.env.DATABASE,{
    useNewUrlParser: true,
    useCreateindex: true
}).then(()=> console.log('DB connected'))

//Routes midlleware
app.use("/api",userRoute)

const port = process.env.PORT || 8000

app.listen(port, ()=> {
    console.log(`Server is running on port ${port}`);
})
