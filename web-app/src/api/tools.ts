// Tool implementations that mirror the MCP server tools
// These execute in the browser using embedded rules data

import { rulesData } from './rulesData';

export async function executeToolCall(
  toolName: string,
  input: Record<string, unknown>
): Promise<string> {
  switch (toolName) {
    case 'search_rules':
      return searchRules(input.query as string, input.category as string | undefined);

    case 'lookup_class':
      return lookupClass(input.className as string, input.includeSubclasses as boolean);

    case 'lookup_ancestry':
      return lookupAncestry(input.ancestryName as string);

    case 'lookup_community':
      return lookupCommunity(input.communityName as string);

    case 'lookup_equipment':
      return lookupEquipment(
        input.type as 'weapon' | 'armor',
        input.tier as number | undefined,
        input.name as string | undefined,
        input.category as 'primary' | 'secondary' | undefined
      );

    case 'lookup_mechanic':
      return lookupMechanic(input.mechanic as string);

    case 'get_domain_info':
      return getDomainInfo(input.domainName as string | undefined);

    case 'list_options':
      return listOptions(input.category as string);

    default:
      return `Unknown tool: ${toolName}`;
  }
}

function searchRules(query: string, category?: string): string {
  const queryLower = query.toLowerCase();
  const queryTerms = queryLower.split(/\s+/);
  const results: { section: string; content: string; relevance: number }[] = [];

  // Search through all rules sections
  for (const [sectionName, content] of Object.entries(rulesData.sections)) {
    // Apply category filter
    if (category && category !== 'all') {
      const categoryMap: Record<string, string[]> = {
        mechanics: ['coreMechanics', 'introduction'],
        classes: ['classes'],
        ancestries: ['ancestries'],
        communities: ['communities'],
        equipment: ['equipment'],
        combat: ['coreMechanics', 'adversaries'],
        gm: ['gmGuidance', 'adversaries'],
      };
      const allowedSections = categoryMap[category] || [];
      if (allowedSections.length > 0 && !allowedSections.includes(sectionName)) {
        continue;
      }
    }

    const contentLower = content.toLowerCase();
    let relevance = 0;

    for (const term of queryTerms) {
      const matches = (contentLower.match(new RegExp(term, 'g')) || []).length;
      relevance += matches;
    }

    if (relevance > 0) {
      // Extract relevant excerpt
      const firstMatch = contentLower.indexOf(queryTerms[0]);
      const start = Math.max(0, firstMatch - 100);
      const end = Math.min(content.length, firstMatch + 500);
      const excerpt = (start > 0 ? '...' : '') + content.substring(start, end) + (end < content.length ? '...' : '');

      results.push({
        section: sectionName,
        content: excerpt,
        relevance,
      });
    }
  }

  results.sort((a, b) => b.relevance - a.relevance);
  const topResults = results.slice(0, 5);

  if (topResults.length === 0) {
    return `No results found for "${query}". Try different search terms.`;
  }

  return topResults
    .map((r, i) => `## Result ${i + 1}: ${r.section}\n\n${r.content}`)
    .join('\n\n---\n\n');
}

function lookupClass(className: string, includeSubclasses?: boolean): string {
  const classData = rulesData.classes[className.toLowerCase()];

  if (!classData) {
    return `Class "${className}" not found. Available classes: Bard, Druid, Guardian, Ranger, Rogue, Seraph, Sorcerer, Warrior, Wizard`;
  }

  let response = `# ${classData.name}\n\n`;
  response += `${classData.description}\n\n`;
  response += `**Domains:** ${classData.domains.join(' & ')}\n`;
  response += `**Starting Evasion:** ${classData.startingEvasion}\n`;
  response += `**Starting HP:** ${classData.startingHP}\n`;
  response += `**Class Items:** ${classData.classItems}\n\n`;

  response += `## Hope Feature (3 Hope)\n`;
  response += `**${classData.hopeFeature.name}:** ${classData.hopeFeature.description}\n\n`;

  if (classData.classFeatures.length > 0) {
    response += `## Class Features\n`;
    for (const feature of classData.classFeatures) {
      response += `- **${feature.name}:** ${feature.description}\n`;
    }
    response += '\n';
  }

  if (includeSubclasses && classData.subclasses) {
    response += `## Subclasses\n\n`;
    for (const subclass of classData.subclasses) {
      response += `### ${subclass.name}`;
      if (subclass.spellcastTrait) {
        response += ` (Spellcast: ${subclass.spellcastTrait})`;
      }
      response += '\n\n';

      for (const feature of subclass.features) {
        const typeLabel = feature.type ? ` [${feature.type}]` : '';
        response += `- **${feature.name}${typeLabel}:** ${feature.description}\n`;
      }
      response += '\n';
    }
  } else if (classData.subclasses) {
    response += `**Subclasses:** ${classData.subclasses.map((s) => s.name).join(' or ')}\n`;
  }

  return response;
}

function lookupAncestry(ancestryName: string): string {
  const ancestryData = rulesData.ancestries[ancestryName.toLowerCase()];

  if (!ancestryData) {
    return `Ancestry "${ancestryName}" not found. Available ancestries: Clank, Drakona, Dwarf, Elf, Faerie, Faun, Firbolg, Fungril, Galapa, Giant, Goblin, Halfling, Human, Infernis, Katari, Orc, Ribbet, Simiah`;
  }

  let response = `# ${ancestryData.name}\n\n`;
  response += `${ancestryData.description}\n\n`;
  response += `## Ancestry Features\n\n`;

  for (const feature of ancestryData.features) {
    response += `- **${feature.name}:** ${feature.description}\n`;
  }

  return response;
}

function lookupCommunity(communityName: string): string {
  const communityData = rulesData.communities[communityName.toLowerCase()];

  if (!communityData) {
    return `Community "${communityName}" not found. Available communities: Highborne, Loreborne, Orderborne, Ridgeborne, Seaborne, Slyborne, Underborne, Wanderborne, Wildborne`;
  }

  let response = `# ${communityData.name}\n\n`;
  response += `${communityData.description}\n\n`;

  if (communityData.adjectives.length > 0) {
    response += `**Personality Adjectives:** ${communityData.adjectives.join(', ')}\n\n`;
  }

  response += `## Community Feature\n\n`;
  response += `**${communityData.feature.name}:** ${communityData.feature.description}\n`;

  return response;
}

function lookupEquipment(
  type: 'weapon' | 'armor',
  tier?: number,
  name?: string,
  category?: 'primary' | 'secondary'
): string {
  if (type === 'weapon') {
    let weapons = rulesData.weapons;

    if (tier) {
      weapons = weapons.filter((w) => w.tier === tier);
    }
    if (category) {
      weapons = weapons.filter((w) => w.category === category);
    }
    if (name) {
      weapons = weapons.filter((w) =>
        w.name.toLowerCase().includes(name.toLowerCase())
      );
    }

    if (weapons.length === 0) {
      return 'No weapons found matching your criteria.';
    }

    let response = `# Weapons\n\n`;
    response += `| Name | Trait | Range | Damage | Burden | Feature |\n`;
    response += `|------|-------|-------|--------|--------|--------|\n`;

    for (const weapon of weapons) {
      response += `| ${weapon.name} | ${weapon.trait} | ${weapon.range} | ${weapon.damage} | ${weapon.burden} | ${weapon.feature || '-'} |\n`;
    }

    return response;
  } else {
    let armorItems = rulesData.armor;

    if (tier) {
      armorItems = armorItems.filter((a) => a.tier === tier);
    }
    if (name) {
      armorItems = armorItems.filter((a) =>
        a.name.toLowerCase().includes(name.toLowerCase())
      );
    }

    if (armorItems.length === 0) {
      return 'No armor found matching your criteria.';
    }

    let response = `# Armor\n\n`;
    response += `| Name | Thresholds (Major/Severe) | Armor Score | Feature |\n`;
    response += `|------|---------------------------|-------------|--------|\n`;

    for (const armor of armorItems) {
      response += `| ${armor.name} | ${armor.thresholds.major}/${armor.thresholds.severe} | ${armor.score} | ${armor.feature || '-'} |\n`;
    }

    return response;
  }
}

function lookupMechanic(mechanicName: string): string {
  const mechanicData = rulesData.mechanics[mechanicName];

  if (!mechanicData) {
    return `Mechanic "${mechanicName}" not found.`;
  }

  return mechanicData;
}

function getDomainInfo(domainName?: string): string {
  if (domainName) {
    const domain = rulesData.domains[domainName.toLowerCase()];
    if (!domain) {
      return `Domain "${domainName}" not found.`;
    }

    return `# ${domain.name}\n\n${domain.description}\n\n**Classes with access:** ${domain.classes.join(', ')}`;
  }

  let response = `# Daggerheart Domains\n\n`;
  for (const domain of Object.values(rulesData.domains)) {
    response += `## ${domain.name}\n`;
    response += `${domain.description}\n`;
    response += `**Classes:** ${domain.classes.join(', ')}\n\n`;
  }

  return response;
}

function listOptions(category: string): string {
  switch (category) {
    case 'classes':
      return `# Available Classes\n\n${Object.keys(rulesData.classes).map((c) => `- ${c.charAt(0).toUpperCase() + c.slice(1)}`).join('\n')}`;

    case 'ancestries':
      return `# Available Ancestries\n\n${Object.keys(rulesData.ancestries).map((a) => `- ${a.charAt(0).toUpperCase() + a.slice(1)}`).join('\n')}`;

    case 'communities':
      return `# Available Communities\n\n${Object.keys(rulesData.communities).map((c) => `- ${c.charAt(0).toUpperCase() + c.slice(1)}`).join('\n')}`;

    case 'domains':
      return `# Available Domains\n\n${Object.keys(rulesData.domains).map((d) => `- ${d.charAt(0).toUpperCase() + d.slice(1)}`).join('\n')}`;

    default:
      return `Unknown category: ${category}`;
  }
}
