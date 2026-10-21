import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { connectDb } from './config/db.js';
import routes from './routes/index.js';
import { ApiError, errorHandler, notFound } from './middleware/error.js';
import { logger } from './utils/logger.js';

const app = express();

// Only the configured frontend origins may call the API from a browser.
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || env.clientUrls.includes(origin)) return callback(null, true);
      return callback(new ApiError(403, 'This origin is not allowed by CORS'));
    },
  }),
);
app.use(express.json({ limit: '1mb' }));

app.get('/', (_req, res) => res.json({ name: 'Yusafir API', status: 'ok' }));
app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

await connectDb();
app.listen(env.port, () => logger.info(`Yusafir API listening on port ${env.port}`));
