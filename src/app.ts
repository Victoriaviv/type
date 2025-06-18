import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger-output.json';
import { initializeDatabase } from './config/database';
import { errorHandler } from './middlewares/errorHandling';

import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import postRoutes from './routes/posts';
// Optional: import indexRoutes if used for other endpoints
// import routes from './routes/index';

dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:3000', // or your frontend origin
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// app.use('/auth',authRoutes);
// app.use('/users',userRoutes);
// app.use('/posts',postRoutes);
app.use(errorHandler);
// const app = express();
app.use('/uploads', express.static('uploads'));
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
 
app.use('/api', authRoutes);
app.use('/api', postRoutes);
app.use('/api',userRoutes);
// Mount API routes
// app.use('/api/v1/auth', authRoutes);
// app.use('/api/v1/users', userRoutes);
// app.use('/api/v1/posts', postRoutes);
// app.use('/api/v1', routes); // If routes/index.ts exports extra general routes

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Only for development

initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(`📚 API Docs available at http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => {
    console.error('❌Failed to start server:', err);
  });

export default app;
