import { Router, Request, Response } from 'express';
import { Domain } from '../models/index.js';

const router = Router();

// GET /api/domains - List all domains
router.get('/', async (_req: Request, res: Response) => {
  try {
    const domains = await Domain.find({}, {
      slug: 1,
      name: 1,
      description: 1,
    }).sort({ name: 1 });
    res.json(domains);
  } catch (error) {
    console.error('Error fetching domains:', error);
    res.status(500).json({ error: 'Failed to fetch domains' });
  }
});

// GET /api/domains/:slug - Get domain detail with classes that use it
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const domain = await Domain.findOne({ slug: req.params.slug });
    if (!domain) {
      return res.status(404).json({ error: 'Domain not found' });
    }
    res.json(domain);
  } catch (error) {
    console.error('Error fetching domain:', error);
    res.status(500).json({ error: 'Failed to fetch domain' });
  }
});

export default router;
