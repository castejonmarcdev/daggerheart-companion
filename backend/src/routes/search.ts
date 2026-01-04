import { Router, Request, Response } from 'express';
import { SearchIndex, Class, Ancestry, Community, Domain, Weapon, Armor, Mechanic } from '../models/index.js';

const router = Router();

// GET /api/search/autocomplete - Autocomplete suggestions
router.get('/autocomplete', async (req: Request, res: Response) => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string' || q.length < 2) {
      return res.json([]);
    }

    const searchTerm = q.toLowerCase();

    // Prefix match on term field
    const results = await SearchIndex.find({
      term: { $regex: `^${searchTerm}`, $options: 'i' }
    })
      .sort({ priority: -1 })
      .limit(10);

    res.json(results.map(r => ({
      displayName: r.displayName,
      type: r.type,
      slug: r.slug,
      preview: r.preview,
    })));
  } catch (error) {
    console.error('Error in autocomplete:', error);
    res.status(500).json({ error: 'Autocomplete failed' });
  }
});

interface SearchResult {
  type: string;
  slug: string;
  name: string;
  preview: string;
}

// Helper to extract preview from a document
function getPreview(doc: Record<string, unknown>): string {
  const text = (doc.summary || doc.description || doc.content || '') as string;
  return text.substring(0, 150);
}

// GET /api/search - Full-text search with optional type filter
router.get('/', async (req: Request, res: Response) => {
  try {
    const { q, type } = req.query;

    if (!q || typeof q !== 'string') {
      return res.json({ results: [] });
    }

    const searchQuery = q.trim();
    const results: SearchResult[] = [];

    const shouldSearch = (t: string) => !type || type === t;

    // Search classes
    if (shouldSearch('class')) {
      const docs = await Class.find(
        { $or: [{ $text: { $search: searchQuery } }, { name: { $regex: searchQuery, $options: 'i' } }] },
        { slug: 1, name: 1, description: 1 }
      ).limit(5);
      for (const doc of docs) {
        results.push({ type: 'class', slug: doc.slug, name: doc.name, preview: getPreview(doc as unknown as Record<string, unknown>) });
      }
    }

    // Search ancestries
    if (shouldSearch('ancestry')) {
      const docs = await Ancestry.find(
        { $or: [{ $text: { $search: searchQuery } }, { name: { $regex: searchQuery, $options: 'i' } }] },
        { slug: 1, name: 1, description: 1 }
      ).limit(5);
      for (const doc of docs) {
        results.push({ type: 'ancestry', slug: doc.slug, name: doc.name, preview: getPreview(doc as unknown as Record<string, unknown>) });
      }
    }

    // Search communities
    if (shouldSearch('community')) {
      const docs = await Community.find(
        { $or: [{ $text: { $search: searchQuery } }, { name: { $regex: searchQuery, $options: 'i' } }] },
        { slug: 1, name: 1, description: 1 }
      ).limit(5);
      for (const doc of docs) {
        results.push({ type: 'community', slug: doc.slug, name: doc.name, preview: getPreview(doc as unknown as Record<string, unknown>) });
      }
    }

    // Search domains
    if (shouldSearch('domain')) {
      const docs = await Domain.find(
        { $or: [{ $text: { $search: searchQuery } }, { name: { $regex: searchQuery, $options: 'i' } }] },
        { slug: 1, name: 1, description: 1 }
      ).limit(5);
      for (const doc of docs) {
        results.push({ type: 'domain', slug: doc.slug, name: doc.name, preview: getPreview(doc as unknown as Record<string, unknown>) });
      }
    }

    // Search weapons
    if (shouldSearch('weapon')) {
      const docs = await Weapon.find(
        { $or: [{ $text: { $search: searchQuery } }, { name: { $regex: searchQuery, $options: 'i' } }] },
        { slug: 1, name: 1 }
      ).limit(5);
      for (const doc of docs) {
        results.push({ type: 'weapon', slug: doc.slug, name: doc.name, preview: `Tier ${doc.tier} ${doc.category} weapon` });
      }
    }

    // Search armor
    if (shouldSearch('armor')) {
      const docs = await Armor.find(
        { $or: [{ $text: { $search: searchQuery } }, { name: { $regex: searchQuery, $options: 'i' } }] },
        { slug: 1, name: 1, tier: 1 }
      ).limit(5);
      for (const doc of docs) {
        results.push({ type: 'armor', slug: doc.slug, name: doc.name, preview: `Tier ${doc.tier} armor` });
      }
    }

    // Search mechanics
    if (shouldSearch('mechanic')) {
      const docs = await Mechanic.find(
        { $or: [{ $text: { $search: searchQuery } }, { name: { $regex: searchQuery, $options: 'i' } }] },
        { slug: 1, name: 1, summary: 1 }
      ).limit(5);
      for (const doc of docs) {
        results.push({ type: 'mechanic', slug: doc.slug, name: doc.name, preview: doc.summary || '' });
      }
    }

    res.json({ results });
  } catch (error) {
    console.error('Error in search:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

export default router;
