import { Router, Request, Response } from 'express';
import { dataStore } from '../data/store.js';

const router = Router();

// GET /api/classes - List all classes
router.get('/', (_req: Request, res: Response) => {
  try {
    const classes = dataStore.getClasses()
      .map(c => ({
        slug: c.slug,
        name: c.name,
        description: c.description,
        domains: c.domains,
        startingEvasion: c.startingEvasion,
        startingHP: c.startingHP,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
    res.json(classes);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
});

// GET /api/classes/:slug - Get class detail with subclasses
router.get('/:slug', (req: Request, res: Response) => {
  try {
    const classData = dataStore.getClassBySlug(req.params.slug);
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
