const express = require('express')
const app=express()
const bodyParser=require('body-parser')
const cookieParser=require('cookie-parser')
const cors=require('cors')

const dotenv=require('dotenv')
dotenv.config()

const port=process.env.PORT

require('./db')

const allowedOrigins = [process.env.FRONTEND_URL];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
// }));
const corsOptions = {
  origin: [
    'http://localhost:3000', 
    'https://community-bulletin-board-3.onrender.com', 
  ],
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET)); 

const authRoutes= require('./routes/authRoutes')
const forumboardRoutes=require('./routes/forumboardRoutes')

app.use('/auth',authRoutes)
app.use('/forumboard',forumboardRoutes)


app.listen(port, '0.0.0.0',()=>{
  console.log(`listening on port ${port}`)
})

