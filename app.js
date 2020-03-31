const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan'); // see routes on console
const bodyParser = require('body-parser')// helps paste objects
const cookieParser = require('cookie-parser')// save users cookie
const expressValidator = require('express-validator')
require('dotenv').config()
// import routes

const authRoute = require('./routes/auth')
const userRoute = require('./routes/user')

//App

const app = express();

//db
mongoose.connect(process.env.DATABASE,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(()=> console.log('DB connected'))

//Middleware
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(expressValidator())

//Routes midlleware
app.use("/api",authRoute)
app.use("/api",userRoute)

const port = process.env.PORT || 8000

app.listen(port, ()=> {
    console.log(`Server is running on port ${port}`);
})
