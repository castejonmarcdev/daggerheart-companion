import { Router, Request, Response } from 'express';
import { dataStore } from '../data/store.js';

const router = Router();

// GET /api/mechanics - List all mechanics
router.get('/', (req: Request, res: Response) => {
  try {
    const { category } = req.query;

    let mechanics = dataStore.getMechanics();

    // Filter by category if provided
    if (category) {
      mechanics = mechanics.filter(m => m.category === category);
    }

    // Map to list format and sort
    const result = mechanics
      .map(m => ({
        slug: m.slug,
        name: m.name,
        category: m.category,
        summary: m.summary,
      }))
      .sort((a, b) => {
        if (a.category !== b.category) return a.category.localeCompare(b.category);
        return a.name.localeCompare(b.name);
      });

    res.json(result);
  } catch (error) {
    console.error('Error fetching mechanics:', error);
    res.status(500).json({ error: 'Failed to fetch mechanics' });
  }
});

// GET /api/mechanics/:slug - Get mechanic detail
router.get('/:slug', (req: Request, res: Response) => {
  try {
    const mechanic = dataStore.getMechanicBySlug(req.params.slug);
    if (!mechanic) {
      return res.status(404).json({ error: 'Mechanic not found' });
    }
    res.json(mechanic);
  } catch (error) {
    console.error('Error fetching mechanic:', error);
    res.status(500).json({ error: 'Failed to fetch mechanic' });
  }
});

export default router;
