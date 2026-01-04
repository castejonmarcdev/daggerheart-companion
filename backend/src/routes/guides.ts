import { Router, Request, Response } from 'express';
import { dataStore } from '../data/store.js';

const router = Router();

// GET /api/guides - List all guides
router.get('/', (_req: Request, res: Response) => {
  try {
    const guides = dataStore.getGuides()
      .map(g => ({
        slug: g.slug,
        name: g.name,
        description: g.description,
        icon: g.icon,
        sections: g.sections.map(s => ({
          title: s.title,
          slug: s.slug,
        })),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
    res.json(guides);
  } catch (error) {
    console.error('Error fetching guides:', error);
    res.status(500).json({ error: 'Failed to fetch guides' });
  }
});

// GET /api/guides/:slug - Get guide detail
router.get('/:slug', (req: Request, res: Response) => {
  try {
    const guide = dataStore.getGuideBySlug(req.params.slug);
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
