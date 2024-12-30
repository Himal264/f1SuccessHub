import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import questionRouter from './routes/questionRoute.js';


// App Config
const app = express();
const port = process.env.PORT || 5000;
connectDB();
connectCloudinary();

// Middleware 
app.use(express.json());
app.use(cors());

// api endpoints 
app.use('/api/user', userRouter);
app.use('/api/question', questionRouter);


app.get('/', (req, res)=> {
  res.send("API Working")
})

app.listen(port, ()=> console.log('Server started on PORT : ' + port))