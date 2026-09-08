import express from 'express';
import cors from 'cors';

import env from './config/env.js';
import authRoutes from './routes/authRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(
  cors({
    origin: env.frontendUrl,
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Ayudoot auth backend is running' });
});

app.use('/api/auth', authRoutes);

// Must be registered last.
app.use(errorHandler);

export default app;