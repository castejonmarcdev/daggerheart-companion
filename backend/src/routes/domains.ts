import { Router, Request, Response } from 'express';
import { dataStore } from '../data/store.js';

const router = Router();

// GET /api/domains - List all domains
router.get('/', (_req: Request, res: Response) => {
  try {
    const domains = dataStore.getDomains()
      .map(d => ({
        slug: d.slug,
        name: d.name,
        description: d.description,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
    res.json(domains);
  } catch (error) {
    console.error('Error fetching domains:', error);
    res.status(500).json({ error: 'Failed to fetch domains' });
  }
});

// GET /api/domains/:slug - Get domain detail with classes that use it
router.get('/:slug', (req: Request, res: Response) => {
  try {
    const domain = dataStore.getDomainBySlug(req.params.slug);
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
