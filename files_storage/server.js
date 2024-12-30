import express from 'express';
import dotenv from 'dotenv';
import uploadRoutes from './routes/uploadRoute.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api', uploadRoutes);

// Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
