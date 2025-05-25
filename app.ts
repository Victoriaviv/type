import express from 'express';
import { initializeDatabase } from './config/database';
import userRoutes from './routes/users';
import postRoutes from './routes/posts';
import "reflect-metadata";


const app = express();
app.use(express.json());
app.use('/api', userRoutes);
app.use('/api', postRoutes);


const PORT = 3000;

initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server:', err);
  });
