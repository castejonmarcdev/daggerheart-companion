import { Router, Request, Response } from 'express';
import { dataStore } from '../data/store.js';

const router = Router();

// GET /api/search/autocomplete - Autocomplete suggestions
router.get('/autocomplete', (req: Request, res: Response) => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string' || q.length < 2) {
      return res.json([]);
    }

    const results = dataStore.autocomplete(q, 10);

    res.json(results.map(r => ({
      displayName: r.displayName,
      type: r.type,
      slug: r.slug,
      preview: r.preview,
    })));
  } catch (error) {
    console.error('Error in autocomplete:', error);
    res.status(500).json({ error: 'Autocomplete failed' });
  }
});

// GET /api/search - Full-text search with optional type filter
router.get('/', (req: Request, res: Response) => {
  try {
    const { q, type } = req.query;

    if (!q || typeof q !== 'string') {
      return res.json({ results: [] });
    }

    const searchQuery = q.trim();
    let results = dataStore.fullTextSearch(searchQuery);

    // Filter by type if provided
    if (type && typeof type === 'string') {
      results = results.filter(r => r.type === type);
    }

    res.json({ results });
  } catch (error) {
    console.error('Error in search:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

export default router;
