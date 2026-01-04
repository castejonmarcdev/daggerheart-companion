import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE,
});

// Types
export interface ClassSummary {
  _id: string;
  slug: string;
  name: string;
  description?: string;
  domains: string[];
  startingEvasion: number;
  startingHP: number;
}

export interface Feature {
  name: string;
  description: string;
  type?: string;
}

export interface Subclass {
  slug: string;
  name: string;
  spellcastTrait?: string;
  features: Feature[];
}

export interface ClassDetail extends ClassSummary {
  classItems?: string;
  hopeFeature: Feature;
  classFeatures: Feature[];
  subclasses: Subclass[];
}

export interface AncestrySummary {
  _id: string;
  slug: string;
  name: string;
  description?: string;
}

export interface AncestryFeature {
  name: string;
  description: string;
}

export interface AncestryDetail extends AncestrySummary {
  features: AncestryFeature[];
}

export interface CommunitySummary {
  _id: string;
  slug: string;
  name: string;
  description?: string;
}

export interface CommunityFeature {
  name: string;
  description: string;
}

export interface CommunityDetail extends CommunitySummary {
  adjectives?: string[];
  feature: CommunityFeature;
}

export interface DomainSummary {
  _id: string;
  slug: string;
  name: string;
  description?: string;
}

export interface DomainDetail extends DomainSummary {
  classes: string[];
}

export interface Weapon {
  _id: string;
  slug: string;
  name: string;
  tier: number;
  category: string;
  trait: string;
  range: string;
  damage: string;
  damageType: string;
  feature?: string;
}

export interface Armor {
  _id: string;
  slug: string;
  name: string;
  tier: number;
  thresholds: { major: number; severe: number };
  score: number;
  feature?: string;
}

export interface MechanicSummary {
  _id: string;
  slug: string;
  name: string;
  category: string;
  summary?: string;
}

export interface MechanicDetail extends MechanicSummary {
  content: string;
}

export interface GuideSection {
  title: string;
  slug: string;
  content: string;
}

export interface GuideSummary {
  _id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  sections: { title: string; slug: string }[];
}

export interface GuideDetail extends GuideSummary {
  sections: GuideSection[];
}

export interface AutocompleteResult {
  displayName: string;
  type: string;
  slug: string;
  preview: string;
}

export interface SearchResult {
  type: string;
  slug: string;
  name: string;
  preview: string;
}

// API functions
export const apiClient = {
  // Classes
  getClasses: () => api.get<ClassSummary[]>('/classes').then(r => r.data),
  getClass: (slug: string) => api.get<ClassDetail>(`/classes/${slug}`).then(r => r.data),

  // Ancestries
  getAncestries: () => api.get<AncestrySummary[]>('/ancestries').then(r => r.data),
  getAncestry: (slug: string) => api.get<AncestryDetail>(`/ancestries/${slug}`).then(r => r.data),

  // Communities
  getCommunities: () => api.get<CommunitySummary[]>('/communities').then(r => r.data),
  getCommunity: (slug: string) => api.get<CommunityDetail>(`/communities/${slug}`).then(r => r.data),

  // Domains
  getDomains: () => api.get<DomainSummary[]>('/domains').then(r => r.data),
  getDomain: (slug: string) => api.get<DomainDetail>(`/domains/${slug}`).then(r => r.data),

  // Equipment
  getWeapons: (filters?: { tier?: number; trait?: string; category?: string }) =>
    api.get<Weapon[]>('/equipment/weapons', { params: filters }).then(r => r.data),
  getWeapon: (slug: string) => api.get<Weapon>(`/equipment/weapons/${slug}`).then(r => r.data),
  getArmor: (filters?: { tier?: number }) =>
    api.get<Armor[]>('/equipment/armor', { params: filters }).then(r => r.data),
  getArmorItem: (slug: string) => api.get<Armor>(`/equipment/armor/${slug}`).then(r => r.data),

  // Mechanics
  getMechanics: (category?: string) =>
    api.get<MechanicSummary[]>('/mechanics', { params: category ? { category } : {} }).then(r => r.data),
  getMechanic: (slug: string) => api.get<MechanicDetail>(`/mechanics/${slug}`).then(r => r.data),

  // Guides
  getGuides: () => api.get<GuideSummary[]>('/guides').then(r => r.data),
  getGuide: (slug: string) => api.get<GuideDetail>(`/guides/${slug}`).then(r => r.data),

  // Search
  autocomplete: (query: string) =>
    api.get<AutocompleteResult[]>('/search/autocomplete', { params: { q: query } }).then(r => r.data),
  search: (query: string, type?: string) =>
    api.get<{ results: SearchResult[] }>('/search', { params: { q: query, type } }).then(r => r.data.results),
};

export default apiClient;
