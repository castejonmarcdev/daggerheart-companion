import { Router, Request, Response } from 'express';
import { dataStore } from '../data/store.js';

const router = Router();

// GET /api/equipment/weapons - List weapons with optional filters
router.get('/weapons', (req: Request, res: Response) => {
  try {
    const { tier, trait, category } = req.query;

    let weapons = dataStore.getWeapons({
      tier: tier ? parseInt(tier as string, 10) : undefined,
      category: category as string | undefined,
    });

    // Filter by trait if provided (not built into getWeapons)
    if (trait) {
      weapons = weapons.filter(w => w.trait === trait);
    }

    // Sort by tier, then name
    weapons.sort((a, b) => {
      if (a.tier !== b.tier) return a.tier - b.tier;
      return a.name.localeCompare(b.name);
    });

    res.json(weapons);
  } catch (error) {
    console.error('Error fetching weapons:', error);
    res.status(500).json({ error: 'Failed to fetch weapons' });
  }
});

// GET /api/equipment/weapons/:slug - Get weapon detail
router.get('/weapons/:slug', (req: Request, res: Response) => {
  try {
    const weapon = dataStore.getWeaponBySlug(req.params.slug);
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
router.get('/armor', (req: Request, res: Response) => {
  try {
    const { tier } = req.query;

    let armor = dataStore.getArmor({
      tier: tier ? parseInt(tier as string, 10) : undefined,
    });

    // Sort by tier, then name
    armor.sort((a, b) => {
      if (a.tier !== b.tier) return a.tier - b.tier;
      return a.name.localeCompare(b.name);
    });

    res.json(armor);
  } catch (error) {
    console.error('Error fetching armor:', error);
    res.status(500).json({ error: 'Failed to fetch armor' });
  }
});

// GET /api/equipment/armor/:slug - Get armor detail
router.get('/armor/:slug', (req: Request, res: Response) => {
  try {
    const armor = dataStore.getArmorBySlug(req.params.slug);
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
