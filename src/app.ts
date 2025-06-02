import express from 'express';
import { initializeDatabase } from './config/database';
import userRoutes from './routes/user'
import authRoutes from './routes/auth';
import postRoutes from './routes/posts';
import "reflect-metadata";
import dotenv from 'dotenv';
dotenv.config();



const app = express();
app.use(express.json());
app.use('/api', authRoutes);
app.use('/api', postRoutes);
app.use('/api',userRoutes)



const PORT = 3000;

initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(` Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server:', err);
  });