const express = require('express')
const app=express()
const bodyParser=require('body-parser')
const cookieParser=require('cookie-parser')
const cors=require('cors')

const dotenv=require('dotenv')
dotenv.config()

const port=process.env.PORT

require('./db')

app.use(cors({
  origin: "https://community-bulletin-board.vercel.app", 
  methods: "GET,POST,PUT,DELETE",   
  credentials: true              
}));

app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET)); 

const authRoutes= require('./routes/authRoutes')
const forumboardRoutes=require('./routes/forumboardRoutes')

app.use('/auth',authRoutes)
app.use('/forumboard',forumboardRoutes)


app.listen(port, '0.0.0.0',()=>{
  console.log(`listening on port ${port}`)
})

