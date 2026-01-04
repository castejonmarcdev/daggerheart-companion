import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Type definitions
interface Feature {
  name: string;
  description: string;
  type?: string;
}

interface Subclass {
  name: string;
  spellcastTrait: string;
  features: Feature[];
}

interface ClassData {
  name: string;
  description: string;
  domains: string[];
  startingEvasion: number;
  startingHP: number;
  classItems: string;
  hopeFeature: { name: string; description: string };
  classFeatures: Feature[];
  subclasses: Subclass[];
}

interface AncestryData {
  name: string;
  description: string;
  features: Feature[];
}

interface CommunityData {
  name: string;
  description: string;
  adjectives: string[];
  feature: { name: string; description: string };
}

interface DomainData {
  name: string;
  description: string;
  classes: string[];
}

interface WeaponData {
  name: string;
  tier: number;
  category: 'primary' | 'secondary';
  trait: string;
  range: string;
  damage: string;
  damageType: 'phy' | 'mag';
  burden: string;
  feature?: string;
}

interface ArmorData {
  name: string;
  tier: number;
  thresholds: { major: number; severe: number };
  score: number;
  feature?: string;
}

interface MechanicData {
  name: string;
  category: string;
  content: string;
  summary: string;
}

interface GuideSection {
  title: string;
  slug: string;
  content: string;
}

interface GuideData {
  name: string;
  description: string;
  icon: string;
  sections: GuideSection[];
}

// Processed types with slugs
export interface ClassDoc {
  slug: string;
  name: string;
  description: string;
  domains: string[];
  startingEvasion: number;
  startingHP: number;
  classItems: string;
  hopeFeature: { name: string; description: string };
  classFeatures: Feature[];
  subclasses: Array<{ slug: string; name: string; spellcastTrait: string; features: Feature[] }>;
  searchText: string;
}

export interface AncestryDoc {
  slug: string;
  name: string;
  description: string;
  features: Feature[];
  searchText: string;
}

export interface CommunityDoc {
  slug: string;
  name: string;
  description: string;
  adjectives: string[];
  feature: { name: string; description: string };
  searchText: string;
}

export interface DomainDoc {
  slug: string;
  name: string;
  description: string;
  classes: string[];
  searchText: string;
}

export interface WeaponDoc {
  slug: string;
  name: string;
  tier: number;
  category: 'primary' | 'secondary';
  trait: string;
  range: string;
  damage: string;
  damageType: 'phy' | 'mag';
  burden: string;
  feature?: string;
  searchText: string;
}

export interface ArmorDoc {
  slug: string;
  name: string;
  tier: number;
  thresholds: { major: number; severe: number };
  score: number;
  feature?: string;
  searchText: string;
}

export interface MechanicDoc {
  slug: string;
  name: string;
  category: string;
  content: string;
  summary: string;
  searchText: string;
}

export interface GuideDoc {
  slug: string;
  name: string;
  description: string;
  icon: string;
  sections: GuideSection[];
  searchText: string;
}

export interface SearchIndexEntry {
  term: string;
  displayName: string;
  type: 'class' | 'ancestry' | 'community' | 'domain' | 'weapon' | 'armor' | 'mechanic' | 'guide' | 'guide-section';
  slug: string;
  priority: number;
  preview: string;
}

// Helper functions
function generateSlug(name: string): string {
  return name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function generateSearchText(...fields: string[]): string {
  return fields.filter(Boolean).join(' ').toLowerCase();
}

function loadJson<T>(filename: string): T {
  const filePath = join(__dirname, filename);
  const content = readFileSync(filePath, 'utf-8');
  return JSON.parse(content) as T;
}

// Data store
class DataStore {
  private classes: ClassDoc[] = [];
  private ancestries: AncestryDoc[] = [];
  private communities: CommunityDoc[] = [];
  private domains: DomainDoc[] = [];
  private weapons: WeaponDoc[] = [];
  private armor: ArmorDoc[] = [];
  private mechanics: MechanicDoc[] = [];
  private guides: GuideDoc[] = [];
  private searchIndex: SearchIndexEntry[] = [];
  private initialized = false;

  initialize(): void {
    if (this.initialized) return;

    console.log('Loading game data from JSON files...');

    // Load classes
    const classesRaw = loadJson<Record<string, ClassData>>('classes.json');
    this.classes = Object.entries(classesRaw).map(([key, data]) => ({
      slug: generateSlug(data.name),
      name: data.name,
      description: data.description,
      domains: data.domains,
      startingEvasion: data.startingEvasion,
      startingHP: data.startingHP,
      classItems: data.classItems,
      hopeFeature: data.hopeFeature,
      classFeatures: data.classFeatures,
      subclasses: data.subclasses.map(sub => ({
        slug: generateSlug(sub.name),
        name: sub.name,
        spellcastTrait: sub.spellcastTrait,
        features: sub.features,
      })),
      searchText: generateSearchText(data.name, data.description, data.hopeFeature.name, ...data.domains),
    }));

    // Load ancestries
    const ancestriesRaw = loadJson<Record<string, AncestryData>>('ancestries.json');
    this.ancestries = Object.entries(ancestriesRaw).map(([key, data]) => ({
      slug: generateSlug(data.name),
      name: data.name,
      description: data.description,
      features: data.features,
      searchText: generateSearchText(data.name, data.description, ...data.features.map(f => f.name)),
    }));

    // Load communities
    const communitiesRaw = loadJson<Record<string, CommunityData>>('communities.json');
    this.communities = Object.entries(communitiesRaw).map(([key, data]) => ({
      slug: generateSlug(data.name),
      name: data.name,
      description: data.description,
      adjectives: data.adjectives,
      feature: data.feature,
      searchText: generateSearchText(data.name, data.description, data.feature.name),
    }));

    // Load domains
    const domainsRaw = loadJson<Record<string, DomainData>>('domains.json');
    this.domains = Object.entries(domainsRaw).map(([key, data]) => ({
      slug: generateSlug(data.name),
      name: data.name,
      description: data.description,
      classes: data.classes,
      searchText: generateSearchText(data.name, data.description),
    }));

    // Load weapons
    const weaponsRaw = loadJson<WeaponData[]>('weapons.json');
    this.weapons = weaponsRaw.map(data => ({
      slug: generateSlug(data.name),
      name: data.name,
      tier: data.tier,
      category: data.category,
      trait: data.trait,
      range: data.range,
      damage: data.damage,
      damageType: data.damageType,
      burden: data.burden,
      feature: data.feature,
      searchText: generateSearchText(data.name, data.trait, data.range, data.feature || ''),
    }));

    // Load armor
    const armorRaw = loadJson<ArmorData[]>('armor.json');
    this.armor = armorRaw.map(data => ({
      slug: generateSlug(data.name),
      name: data.name,
      tier: data.tier,
      thresholds: data.thresholds,
      score: data.score,
      feature: data.feature,
      searchText: generateSearchText(data.name, data.feature || ''),
    }));

    // Load mechanics
    const mechanicsRaw = loadJson<Record<string, MechanicData>>('mechanics.json');
    this.mechanics = Object.entries(mechanicsRaw).map(([key, data]) => ({
      slug: key,
      name: data.name,
      category: data.category,
      content: data.content,
      summary: data.summary,
      searchText: generateSearchText(data.name, data.content, data.summary),
    }));

    // Load guides
    const guidesRaw = loadJson<Record<string, GuideData>>('guides.json');
    this.guides = Object.entries(guidesRaw).map(([slug, data]) => ({
      slug,
      name: data.name,
      description: data.description,
      icon: data.icon,
      sections: data.sections,
      searchText: generateSearchText(
        data.name,
        data.description,
        ...data.sections.map(s => s.title + ' ' + s.content)
      ),
    }));

    // Build search index
    this.buildSearchIndex();

    this.initialized = true;
    console.log('Game data loaded successfully!');
  }

  private buildSearchIndex(): void {
    this.searchIndex = [];

    // Classes (highest priority)
    for (const c of this.classes) {
      this.searchIndex.push({
        term: c.name.toLowerCase(),
        displayName: c.name,
        type: 'class',
        slug: c.slug,
        priority: 100,
        preview: c.description.substring(0, 80) + '...',
      });
    }

    // Ancestries
    for (const a of this.ancestries) {
      this.searchIndex.push({
        term: a.name.toLowerCase(),
        displayName: a.name,
        type: 'ancestry',
        slug: a.slug,
        priority: 90,
        preview: a.description.substring(0, 80) + '...',
      });
    }

    // Communities
    for (const c of this.communities) {
      this.searchIndex.push({
        term: c.name.toLowerCase(),
        displayName: c.name,
        type: 'community',
        slug: c.slug,
        priority: 80,
        preview: c.description.substring(0, 80) + '...',
      });
    }

    // Domains
    for (const d of this.domains) {
      this.searchIndex.push({
        term: d.name.toLowerCase(),
        displayName: d.name,
        type: 'domain',
        slug: d.slug,
        priority: 85,
        preview: d.description.substring(0, 80) + '...',
      });
    }

    // Weapons
    for (const w of this.weapons) {
      this.searchIndex.push({
        term: w.name.toLowerCase(),
        displayName: w.name,
        type: 'weapon',
        slug: w.slug,
        priority: 70,
        preview: `${w.trait} ${w.range} weapon - ${w.damage}`,
      });
    }

    // Armor
    for (const a of this.armor) {
      this.searchIndex.push({
        term: a.name.toLowerCase(),
        displayName: a.name,
        type: 'armor',
        slug: a.slug,
        priority: 70,
        preview: `Thresholds ${a.thresholds.major}/${a.thresholds.severe}, Score ${a.score}`,
      });
    }

    // Mechanics
    for (const m of this.mechanics) {
      this.searchIndex.push({
        term: m.name.toLowerCase(),
        displayName: m.name,
        type: 'mechanic',
        slug: m.slug,
        priority: 95,
        preview: m.summary,
      });
    }

    // Guides
    for (const g of this.guides) {
      this.searchIndex.push({
        term: g.name.toLowerCase(),
        displayName: g.name,
        type: 'guide',
        slug: g.slug,
        priority: 90,
        preview: g.description.substring(0, 80) + '...',
      });
      // Also add individual sections
      for (const section of g.sections) {
        this.searchIndex.push({
          term: section.title.toLowerCase(),
          displayName: `${g.name}: ${section.title}`,
          type: 'guide-section',
          slug: `${g.slug}#${section.slug}`,
          priority: 75,
          preview: section.content.substring(0, 80) + '...',
        });
      }
    }
  }

  // Query methods
  getClasses(): ClassDoc[] {
    return this.classes;
  }

  getClassBySlug(slug: string): ClassDoc | undefined {
    return this.classes.find(c => c.slug === slug);
  }

  getAncestries(): AncestryDoc[] {
    return this.ancestries;
  }

  getAncestryBySlug(slug: string): AncestryDoc | undefined {
    return this.ancestries.find(a => a.slug === slug);
  }

  getCommunities(): CommunityDoc[] {
    return this.communities;
  }

  getCommunityBySlug(slug: string): CommunityDoc | undefined {
    return this.communities.find(c => c.slug === slug);
  }

  getDomains(): DomainDoc[] {
    return this.domains;
  }

  getDomainBySlug(slug: string): DomainDoc | undefined {
    return this.domains.find(d => d.slug === slug);
  }

  getWeapons(filters?: { tier?: number; category?: string }): WeaponDoc[] {
    let result = this.weapons;
    if (filters?.tier) {
      result = result.filter(w => w.tier === filters.tier);
    }
    if (filters?.category) {
      result = result.filter(w => w.category === filters.category);
    }
    return result;
  }

  getWeaponBySlug(slug: string): WeaponDoc | undefined {
    return this.weapons.find(w => w.slug === slug);
  }

  getArmor(filters?: { tier?: number }): ArmorDoc[] {
    let result = this.armor;
    if (filters?.tier) {
      result = result.filter(a => a.tier === filters.tier);
    }
    return result;
  }

  getArmorBySlug(slug: string): ArmorDoc | undefined {
    return this.armor.find(a => a.slug === slug);
  }

  getMechanics(): MechanicDoc[] {
    return this.mechanics;
  }

  getMechanicBySlug(slug: string): MechanicDoc | undefined {
    return this.mechanics.find(m => m.slug === slug);
  }

  getGuides(): GuideDoc[] {
    return this.guides;
  }

  getGuideBySlug(slug: string): GuideDoc | undefined {
    return this.guides.find(g => g.slug === slug);
  }

  // Search methods
  search(query: string): SearchIndexEntry[] {
    const lowerQuery = query.toLowerCase();
    return this.searchIndex
      .filter(entry =>
        entry.term.includes(lowerQuery) ||
        entry.displayName.toLowerCase().includes(lowerQuery) ||
        entry.preview.toLowerCase().includes(lowerQuery)
      )
      .sort((a, b) => b.priority - a.priority);
  }

  autocomplete(query: string, limit = 10): SearchIndexEntry[] {
    const lowerQuery = query.toLowerCase();
    return this.searchIndex
      .filter(entry => entry.term.startsWith(lowerQuery) || entry.term.includes(lowerQuery))
      .sort((a, b) => {
        // Prioritize exact prefix matches
        const aStartsWith = a.term.startsWith(lowerQuery) ? 1 : 0;
        const bStartsWith = b.term.startsWith(lowerQuery) ? 1 : 0;
        if (aStartsWith !== bStartsWith) return bStartsWith - aStartsWith;
        return b.priority - a.priority;
      })
      .slice(0, limit);
  }

  // Full-text search across all content
  fullTextSearch(query: string): Array<{ type: string; slug: string; name: string; preview: string; score: number }> {
    const lowerQuery = query.toLowerCase();
    const results: Array<{ type: string; slug: string; name: string; preview: string; score: number }> = [];

    // Search classes
    for (const c of this.classes) {
      if (c.searchText.includes(lowerQuery)) {
        results.push({
          type: 'class',
          slug: c.slug,
          name: c.name,
          preview: c.description.substring(0, 100),
          score: c.name.toLowerCase().includes(lowerQuery) ? 100 : 50,
        });
      }
    }

    // Search ancestries
    for (const a of this.ancestries) {
      if (a.searchText.includes(lowerQuery)) {
        results.push({
          type: 'ancestry',
          slug: a.slug,
          name: a.name,
          preview: a.description.substring(0, 100),
          score: a.name.toLowerCase().includes(lowerQuery) ? 90 : 45,
        });
      }
    }

    // Search communities
    for (const c of this.communities) {
      if (c.searchText.includes(lowerQuery)) {
        results.push({
          type: 'community',
          slug: c.slug,
          name: c.name,
          preview: c.description.substring(0, 100),
          score: c.name.toLowerCase().includes(lowerQuery) ? 80 : 40,
        });
      }
    }

    // Search domains
    for (const d of this.domains) {
      if (d.searchText.includes(lowerQuery)) {
        results.push({
          type: 'domain',
          slug: d.slug,
          name: d.name,
          preview: d.description.substring(0, 100),
          score: d.name.toLowerCase().includes(lowerQuery) ? 85 : 42,
        });
      }
    }

    // Search mechanics
    for (const m of this.mechanics) {
      if (m.searchText.includes(lowerQuery)) {
        results.push({
          type: 'mechanic',
          slug: m.slug,
          name: m.name,
          preview: m.summary,
          score: m.name.toLowerCase().includes(lowerQuery) ? 95 : 47,
        });
      }
    }

    // Search guides
    for (const g of this.guides) {
      if (g.searchText.includes(lowerQuery)) {
        results.push({
          type: 'guide',
          slug: g.slug,
          name: g.name,
          preview: g.description.substring(0, 100),
          score: g.name.toLowerCase().includes(lowerQuery) ? 90 : 45,
        });
      }
    }

    return results.sort((a, b) => b.score - a.score);
  }
}

// Export singleton instance
export const dataStore = new DataStore();
