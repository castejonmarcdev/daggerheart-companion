import { Router, Request, Response } from 'express';
import { Mechanic } from '../models/index.js';

const router = Router();

// GET /api/mechanics - List all mechanics
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const filter: Record<string, unknown> = {};

    if (category) {
      filter.category = category;
    }

    const mechanics = await Mechanic.find(filter, {
      slug: 1,
      name: 1,
      category: 1,
      summary: 1,
    }).sort({ category: 1, name: 1 });
    res.json(mechanics);
  } catch (error) {
    console.error('Error fetching mechanics:', error);
    res.status(500).json({ error: 'Failed to fetch mechanics' });
  }
});

// GET /api/mechanics/:slug - Get mechanic detail
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const mechanic = await Mechanic.findOne({ slug: req.params.slug });
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
