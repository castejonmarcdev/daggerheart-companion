import { Router, Request, Response } from 'express';
import { dataStore } from '../data/store.js';

const router = Router();

// GET /api/communities - List all communities
router.get('/', (_req: Request, res: Response) => {
  try {
    const communities = dataStore.getCommunities()
      .map(c => ({
        slug: c.slug,
        name: c.name,
        description: c.description,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
    res.json(communities);
  } catch (error) {
    console.error('Error fetching communities:', error);
    res.status(500).json({ error: 'Failed to fetch communities' });
  }
});

// GET /api/communities/:slug - Get community detail
router.get('/:slug', (req: Request, res: Response) => {
  try {
    const community = dataStore.getCommunityBySlug(req.params.slug);
    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }
    res.json(community);
  } catch (error) {
    console.error('Error fetching community:', error);
    res.status(500).json({ error: 'Failed to fetch community' });
  }
});

export default router;
