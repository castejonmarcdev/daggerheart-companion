import { Router, Request, Response } from 'express';
import { dataStore } from '../data/store.js';

const router = Router();

// GET /api/ancestries - List all ancestries
router.get('/', (_req: Request, res: Response) => {
  try {
    const ancestries = dataStore.getAncestries()
      .map(a => ({
        slug: a.slug,
        name: a.name,
        description: a.description,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
    res.json(ancestries);
  } catch (error) {
    console.error('Error fetching ancestries:', error);
    res.status(500).json({ error: 'Failed to fetch ancestries' });
  }
});

// GET /api/ancestries/:slug - Get ancestry detail
router.get('/:slug', (req: Request, res: Response) => {
  try {
    const ancestry = dataStore.getAncestryBySlug(req.params.slug);
    if (!ancestry) {
      return res.status(404).json({ error: 'Ancestry not found' });
    }
    res.json(ancestry);
  } catch (error) {
    console.error('Error fetching ancestry:', error);
    res.status(500).json({ error: 'Failed to fetch ancestry' });
  }
});

export default router;
