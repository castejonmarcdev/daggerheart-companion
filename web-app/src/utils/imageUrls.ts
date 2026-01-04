// Daggerheart Card Creator CDN image URLs
const CDN_BASE = 'https://pub-cdae2c597d234591b04eed47a98f233c.r2.dev/v1/card-header-images';

export type ImageCategory = 'ancestry' | 'community' | 'domain' | 'subclass';

export function getImageUrl(category: ImageCategory, slug: string): string {
  // Normalize the slug for the CDN (lowercase, hyphens)
  const normalizedSlug = slug.toLowerCase().replace(/\s+/g, '-');
  return `${CDN_BASE}/${category}/${normalizedSlug}.webp`;
}

// Ancestry images
export function getAncestryImage(slug: string): string {
  return getImageUrl('ancestry', slug);
}

// Community images
export function getCommunityImage(slug: string): string {
  return getImageUrl('community', slug);
}

// Domain images
export function getDomainImage(slug: string): string {
  return getImageUrl('domain', slug);
}

// Subclass images
export function getSubclassImage(slug: string): string {
  return getImageUrl('subclass', slug);
}
