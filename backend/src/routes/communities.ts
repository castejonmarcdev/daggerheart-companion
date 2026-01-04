import { Router, Request, Response } from 'express';
import { Community } from '../models/index.js';

const router = Router();

// GET /api/communities - List all communities
router.get('/', async (_req: Request, res: Response) => {
  try {
    const communities = await Community.find({}, {
      slug: 1,
      name: 1,
      description: 1,
    }).sort({ name: 1 });
    res.json(communities);
  } catch (error) {
    console.error('Error fetching communities:', error);
    res.status(500).json({ error: 'Failed to fetch communities' });
  }
});

// GET /api/communities/:slug - Get community detail
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const community = await Community.findOne({ slug: req.params.slug });
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
