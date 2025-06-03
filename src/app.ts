import express from 'express';
import { initializeDatabase } from './config/database';
import userRoutes from './routes/user'
import authRoutes from './routes/auth';
import postRoutes from './routes/posts';
import "reflect-metadata";
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes/index';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger-output.json';
import { errorHandler } from './middlewares/errorHandling';
dotenv.config();



const app = express();

app.use(express.json());
// app.use('/api', authRoutes);
// app.use('/api', postRoutes);
// app.use('/api',userRoutes);
app.use('/auth',authRoutes);
app.use('/users',userRoutes);
app.use('/posts',postRoutes);
app.use(errorHandler);


app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));

// Mount API routes under /api/v1 prefix
app.use('/api/v1', routes);

// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));




const PORT = 3000;

initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(` Server running at http://localhost:${PORT}`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);

    });
  })
  .catch((err) => {
    console.error('Failed to start server:', err);
  });
  export default app;