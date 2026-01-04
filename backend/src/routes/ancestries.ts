import { Router, Request, Response } from 'express';
import { Ancestry } from '../models/index.js';

const router = Router();

// GET /api/ancestries - List all ancestries
router.get('/', async (_req: Request, res: Response) => {
  try {
    const ancestries = await Ancestry.find({}, {
      slug: 1,
      name: 1,
      description: 1,
    }).sort({ name: 1 });
    res.json(ancestries);
  } catch (error) {
    console.error('Error fetching ancestries:', error);
    res.status(500).json({ error: 'Failed to fetch ancestries' });
  }
});

// GET /api/ancestries/:slug - Get ancestry detail
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const ancestry = await Ancestry.findOne({ slug: req.params.slug });
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
