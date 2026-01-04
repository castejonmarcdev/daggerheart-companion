import { Router, Request, Response } from 'express';
import { Weapon, Armor } from '../models/index.js';

const router = Router();

// GET /api/equipment/weapons - List weapons with optional filters
router.get('/weapons', async (req: Request, res: Response) => {
  try {
    const { tier, trait, category } = req.query;
    const filter: Record<string, unknown> = {};

    if (tier) {
      filter.tier = parseInt(tier as string, 10);
    }
    if (trait) {
      filter.trait = trait;
    }
    if (category) {
      filter.category = category;
    }

    const weapons = await Weapon.find(filter).sort({ tier: 1, name: 1 });
    res.json(weapons);
  } catch (error) {
    console.error('Error fetching weapons:', error);
    res.status(500).json({ error: 'Failed to fetch weapons' });
  }
});

// GET /api/equipment/weapons/:slug - Get weapon detail
router.get('/weapons/:slug', async (req: Request, res: Response) => {
  try {
    const weapon = await Weapon.findOne({ slug: req.params.slug });
    if (!weapon) {
      return res.status(404).json({ error: 'Weapon not found' });
    }
    res.json(weapon);
  } catch (error) {
    console.error('Error fetching weapon:', error);
    res.status(500).json({ error: 'Failed to fetch weapon' });
  }
});

// GET /api/equipment/armor - List armor with optional tier filter
router.get('/armor', async (req: Request, res: Response) => {
  try {
    const { tier } = req.query;
    const filter: Record<string, unknown> = {};

    if (tier) {
      filter.tier = parseInt(tier as string, 10);
    }

    const armor = await Armor.find(filter).sort({ tier: 1, name: 1 });
    res.json(armor);
  } catch (error) {
    console.error('Error fetching armor:', error);
    res.status(500).json({ error: 'Failed to fetch armor' });
  }
});

// GET /api/equipment/armor/:slug - Get armor detail
router.get('/armor/:slug', async (req: Request, res: Response) => {
  try {
    const armor = await Armor.findOne({ slug: req.params.slug });
    if (!armor) {
      return res.status(404).json({ error: 'Armor not found' });
    }
    res.json(armor);
  } catch (error) {
    console.error('Error fetching armor:', error);
    res.status(500).json({ error: 'Failed to fetch armor' });
  }
});

export default router;
