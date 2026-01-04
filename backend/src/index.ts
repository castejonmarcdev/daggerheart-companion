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
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
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

async function start() {
  try {
    await connectDB();
    app.listen(Number(PORT), HOST, () => {
      console.log(`🗡️ Daggerheart API running on http://${HOST}:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
