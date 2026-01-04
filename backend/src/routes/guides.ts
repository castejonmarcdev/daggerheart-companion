import { Router, Request, Response } from 'express';
import { Guide } from '../models/index.js';

const router = Router();

// GET /api/guides - List all guides
router.get('/', async (req: Request, res: Response) => {
  try {
    const guides = await Guide.find({}, {
      slug: 1,
      name: 1,
      description: 1,
      icon: 1,
      'sections.title': 1,
      'sections.slug': 1,
    }).sort({ name: 1 });
    res.json(guides);
  } catch (error) {
    console.error('Error fetching guides:', error);
    res.status(500).json({ error: 'Failed to fetch guides' });
  }
});

// GET /api/guides/:slug - Get guide detail
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const guide = await Guide.findOne({ slug: req.params.slug });
    if (!guide) {
      return res.status(404).json({ error: 'Guide not found' });
    }
    res.json(guide);
  } catch (error) {
    console.error('Error fetching guide:', error);
    res.status(500).json({ error: 'Failed to fetch guide' });
  }
});

export default router;
