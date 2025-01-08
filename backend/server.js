import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import questionRouter from './routes/questionRoute.js';
import emailRoutes from './routes/emailRoutes.js';
import universityRouter from './routes/universityRoutes.js';
import {fileURLToPath} from 'url';
import { dirname } from 'path';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// App Config
const app = express();
const port = process.env.PORT || 9000;
connectDB();
connectCloudinary();

// Middleware 
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

// api endpoints 
app.use('/api/user', userRouter);
app.use('/api/question', questionRouter);
app.use('/api/email', emailRoutes);

//university api endpoints
app.use('/api/university', universityRouter);
app.use('/api/university/:id', universityRouter);
// app.use('/api/university', universityRouter);
app.use("/api/university", universityRouter);





app.get('/', (req, res)=> {
  res.send("API Working")
})

app.listen(port, ()=> console.log('Server started on PORT : ' + port))