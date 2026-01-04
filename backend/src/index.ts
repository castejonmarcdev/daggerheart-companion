import express from 'express';
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
async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🗡️ Daggerheart API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
