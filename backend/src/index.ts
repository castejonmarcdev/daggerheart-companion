import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import {
  classesRouter,
  ancestriesRouter,
  communitiesRouter,
  domainsRouter,
  equipmentRouter,
  mechanicsRouter,
  guidesRouter,
  searchRouter,
} from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/classes', classesRouter);
app.use('/api/ancestries', ancestriesRouter);
app.use('/api/communities', communitiesRouter);
app.use('/api/domains', domainsRouter);
app.use('/api/equipment', equipmentRouter);
app.use('/api/mechanics', mechanicsRouter);
app.use('/api/guides', guidesRouter);
app.use('/api/search', searchRouter);

// Health check
let dbConnected = false;
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: dbConnected ? 'connected' : 'connecting'
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ERROR ${req.method} ${req.path}:`, err.message);
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const publicPath = path.join(__dirname, '..', 'public');
  app.use(express.static(publicPath));

  // Handle SPA routing - serve index.html for all non-API routes
  app.get('*', (_req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });
}

// Start server
const HOST = process.env.HOST || '0.0.0.0';

async function connectWithRetry(maxRetries = 30, delayMs = 2000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[${new Date().toISOString()}] MongoDB connection attempt ${attempt}/${maxRetries}...`);
      await connectDB();
      dbConnected = true;
      console.log(`[${new Date().toISOString()}] MongoDB connected successfully!`);
      return;
    } catch (error) {
      console.error(`[${new Date().toISOString()}] MongoDB connection attempt ${attempt} failed:`, error instanceof Error ? error.message : error);
      if (attempt < maxRetries) {
        console.log(`[${new Date().toISOString()}] Retrying in ${delayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }
  console.error(`[${new Date().toISOString()}] Failed to connect to MongoDB after ${maxRetries} attempts`);
}

async function start() {
  // Start server immediately so health checks pass
  app.listen(Number(PORT), HOST, () => {
    console.log(`🗡️ Daggerheart API running on http://${HOST}:${PORT}`);
  });

  // Connect to MongoDB in the background with retries
  connectWithRetry().catch(error => {
    console.error('MongoDB connection failed:', error);
  });
}

start();
