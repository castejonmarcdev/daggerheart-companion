import { Router, Request, Response } from 'express';
import { Class } from '../models/index.js';

const router = Router();

// GET /api/classes - List all classes
router.get('/', async (_req: Request, res: Response) => {
  try {
    const classes = await Class.find({}, {
      slug: 1,
      name: 1,
      description: 1,
      domains: 1,
      startingEvasion: 1,
      startingHP: 1,
    }).sort({ name: 1 });
    res.json(classes);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
});

// GET /api/classes/:slug - Get class detail with subclasses
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const classData = await Class.findOne({ slug: req.params.slug });
    if (!classData) {
      return res.status(404).json({ error: 'Class not found' });
    }
    res.json(classData);
  } catch (error) {
    console.error('Error fetching class:', error);
    res.status(500).json({ error: 'Failed to fetch class' });
  }
});

export default router;
