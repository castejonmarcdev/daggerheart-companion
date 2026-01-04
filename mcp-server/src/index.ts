#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { RulesLoader } from "./rulesLoader.js";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to rules files
const RULES_PATH = path.join(__dirname, "..", "..", "resources");

async function main() {
  const rulesLoader = new RulesLoader(RULES_PATH);

  // Pre-load rules
  await rulesLoader.loadAllRules();
  console.error("Daggerheart MCP Server: Rules loaded successfully");

  const server = new Server(
    {
      name: "daggerheart-mcp",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
        resources: {},
      },
    }
  );

  // List available tools
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: "search_rules",
          description:
            "Search Daggerheart rules by keyword or topic. Use this to find specific rules, mechanics, or game concepts.",
          inputSchema: {
            type: "object" as const,
            properties: {
              query: {
                type: "string",
                description:
                  "The search term or topic to look up (e.g., 'hope', 'critical success', 'rest')",
              },
              category: {
                type: "string",
                enum: [
                  "mechanics",
                  "classes",
                  "ancestries",
                  "communities",
                  "equipment",
                  "combat",
                  "gm",
                  "all",
                ],
                description: "Optional category to narrow search",
              },
            },
            required: ["query"],
          },
        },
        {
          name: "lookup_class",
          description:
            "Get detailed information about a Daggerheart class including features, domains, and subclasses.",
          inputSchema: {
            type: "object" as const,
            properties: {
              className: {
                type: "string",
                enum: [
                  "Bard",
                  "Druid",
                  "Guardian",
                  "Ranger",
                  "Rogue",
                  "Seraph",
                  "Sorcerer",
                  "Warrior",
                  "Wizard",
                ],
                description: "The name of the class to look up",
              },
              includeSubclasses: {
                type: "boolean",
                description: "Whether to include detailed subclass information",
              },
            },
            required: ["className"],
          },
        },
        {
          name: "lookup_ancestry",
          description:
            "Get detailed information about a Daggerheart ancestry including physical description and both ancestry features.",
          inputSchema: {
            type: "object" as const,
            properties: {
              ancestryName: {
                type: "string",
                enum: [
                  "Clank",
                  "Drakona",
                  "Dwarf",
                  "Elf",
                  "Faerie",
                  "Faun",
                  "Firbolg",
                  "Fungril",
                  "Galapa",
                  "Giant",
                  "Goblin",
                  "Halfling",
                  "Human",
                  "Infernis",
                  "Katari",
                  "Orc",
                  "Ribbet",
                  "Simiah",
                  "Mixed Ancestry",
                ],
                description: "The name of the ancestry to look up",
              },
            },
            required: ["ancestryName"],
          },
        },
        {
          name: "lookup_community",
          description:
            "Get detailed information about a Daggerheart community including description, personality adjectives, and community feature.",
          inputSchema: {
            type: "object" as const,
            properties: {
              communityName: {
                type: "string",
                enum: [
                  "Highborne",
                  "Loreborne",
                  "Orderborne",
                  "Ridgeborne",
                  "Seaborne",
                  "Slyborne",
                  "Underborne",
                  "Wanderborne",
                  "Wildborne",
                ],
                description: "The name of the community to look up",
              },
            },
            required: ["communityName"],
          },
        },
        {
          name: "lookup_equipment",
          description:
            "Look up Daggerheart weapons or armor. Can filter by tier or search for specific items.",
          inputSchema: {
            type: "object" as const,
            properties: {
              type: {
                type: "string",
                enum: ["weapon", "armor"],
                description: "Type of equipment to look up",
              },
              tier: {
                type: "number",
                enum: [1, 2, 3, 4],
                description: "Equipment tier (1-4)",
              },
              name: {
                type: "string",
                description: "Specific equipment name to look up",
              },
              category: {
                type: "string",
                enum: ["primary", "secondary"],
                description: "For weapons: filter by category",
              },
            },
            required: ["type"],
          },
        },
        {
          name: "lookup_mechanic",
          description:
            "Get detailed explanation of a Daggerheart core mechanic.",
          inputSchema: {
            type: "object" as const,
            properties: {
              mechanic: {
                type: "string",
                enum: [
                  "duality_dice",
                  "action_roll",
                  "hope",
                  "fear",
                  "evasion",
                  "stress",
                  "hit_points",
                  "damage_thresholds",
                  "attack",
                  "critical_success",
                  "advantage",
                  "disadvantage",
                  "conditions",
                  "short_rest",
                  "long_rest",
                  "death",
                  "leveling_up",
                  "multiclassing",
                  "ranges",
                  "armor_slots",
                ],
                description: "The mechanic to look up",
              },
            },
            required: ["mechanic"],
          },
        },
        {
          name: "get_domain_info",
          description:
            "Get information about Daggerheart domains including which classes have access to them.",
          inputSchema: {
            type: "object" as const,
            properties: {
              domainName: {
                type: "string",
                enum: [
                  "Arcana",
                  "Blade",
                  "Bone",
                  "Codex",
                  "Grace",
                  "Midnight",
                  "Sage",
                  "Splendor",
                  "Valor",
                ],
                description:
                  "Optional: specific domain to look up. If omitted, returns all domains.",
              },
            },
            required: [],
          },
        },
        {
          name: "list_options",
          description:
            "List all available options for a category (classes, ancestries, or communities).",
          inputSchema: {
            type: "object" as const,
            properties: {
              category: {
                type: "string",
                enum: ["classes", "ancestries", "communities", "domains"],
                description: "The category to list options for",
              },
            },
            required: ["category"],
          },
        },
      ],
    };
  });

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      switch (name) {
        case "search_rules": {
          const query = args?.query as string;
          const category = args?.category as string | undefined;
          const results = await rulesLoader.searchRules(query, category);

          if (results.length === 0) {
            return {
              content: [
                {
                  type: "text" as const,
                  text: `No results found for "${query}". Try different search terms or broaden your search.`,
                },
              ],
            };
          }

          const formattedResults = results
            .map(
              (r, i) =>
                `## Result ${i + 1}: ${r.section}\n\n${r.content}`
            )
            .join("\n\n---\n\n");

          return {
            content: [
              {
                type: "text" as const,
                text: formattedResults,
              },
            ],
          };
        }

        case "lookup_class": {
          const className = args?.className as string;
          const includeSubclasses = args?.includeSubclasses as boolean;
          const classData = await rulesLoader.getClass(className);

          if (!classData) {
            return {
              content: [
                {
                  type: "text" as const,
                  text: `Class "${className}" not found.`,
                },
              ],
            };
          }

          let response = `# ${classData.name}\n\n`;
          response += `${classData.description}\n\n`;
          response += `**Domains:** ${classData.domains.join(" & ")}\n`;
          response += `**Starting Evasion:** ${classData.startingEvasion}\n`;
          response += `**Starting HP:** ${classData.startingHP}\n`;
          response += `**Class Items:** ${classData.classItems}\n\n`;

          response += `## Hope Feature\n`;
          response += `**${classData.hopeFeature.name}:** ${classData.hopeFeature.description}\n\n`;

          if (classData.classFeatures.length > 0) {
            response += `## Class Features\n`;
            for (const feature of classData.classFeatures) {
              response += `- **${feature.name}:** ${feature.description}\n`;
            }
            response += "\n";
          }

          if (includeSubclasses && classData.subclasses.length > 0) {
            response += `## Subclasses\n\n`;
            for (const subclass of classData.subclasses) {
              response += `### ${subclass.name}`;
              if (subclass.spellcastTrait) {
                response += ` (Spellcast: ${subclass.spellcastTrait})`;
              }
              response += "\n\n";

              for (const feature of subclass.features) {
                const typeLabel = feature.type
                  ? ` [${feature.type}]`
                  : "";
                response += `- **${feature.name}${typeLabel}:** ${feature.description}\n`;
              }
              response += "\n";
            }
          } else {
            response += `**Subclasses:** ${classData.subclasses.map((s) => s.name).join(" or ")}\n`;
          }

          return {
            content: [
              {
                type: "text" as const,
                text: response,
              },
            ],
          };
        }

        case "lookup_ancestry": {
          const ancestryName = args?.ancestryName as string;
          const ancestryData = await rulesLoader.getAncestry(ancestryName);

          if (!ancestryData) {
            return {
              content: [
                {
                  type: "text" as const,
                  text: `Ancestry "${ancestryName}" not found.`,
                },
              ],
            };
          }

          let response = `# ${ancestryData.name}\n\n`;
          response += `${ancestryData.description}\n\n`;
          response += `## Ancestry Features\n\n`;

          for (const feature of ancestryData.features) {
            response += `- **${feature.name}:** ${feature.description}\n`;
          }

          return {
            content: [
              {
                type: "text" as const,
                text: response,
              },
            ],
          };
        }

        case "lookup_community": {
          const communityName = args?.communityName as string;
          const communityData = await rulesLoader.getCommunity(communityName);

          if (!communityData) {
            return {
              content: [
                {
                  type: "text" as const,
                  text: `Community "${communityName}" not found.`,
                },
              ],
            };
          }

          let response = `# ${communityData.name}\n\n`;
          response += `${communityData.description}\n\n`;

          if (communityData.adjectives.length > 0) {
            response += `**Personality Adjectives:** ${communityData.adjectives.join(", ")}\n\n`;
          }

          response += `## Community Feature\n\n`;
          response += `**${communityData.feature.name}:** ${communityData.feature.description}\n`;

          return {
            content: [
              {
                type: "text" as const,
                text: response,
              },
            ],
          };
        }

        case "lookup_equipment": {
          const type = args?.type as "weapon" | "armor";
          const tier = args?.tier as number | undefined;
          const itemName = args?.name as string | undefined;
          const category = args?.category as "primary" | "secondary" | undefined;

          if (type === "weapon") {
            const weapons = await rulesLoader.getWeapons({
              tier,
              category,
              name: itemName,
            });

            if (weapons.length === 0) {
              return {
                content: [
                  {
                    type: "text" as const,
                    text: "No weapons found matching your criteria.",
                  },
                ],
              };
            }

            let response = `# Weapons\n\n`;
            response += `| Name | Trait | Range | Damage | Burden | Feature |\n`;
            response += `|------|-------|-------|--------|--------|--------|\n`;

            for (const weapon of weapons) {
              response += `| ${weapon.name} | ${weapon.trait} | ${weapon.range} | ${weapon.damage} | ${weapon.burden} | ${weapon.feature || "-"} |\n`;
            }

            return {
              content: [
                {
                  type: "text" as const,
                  text: response,
                },
              ],
            };
          } else {
            const armorItems = await rulesLoader.getArmor({ tier, name: itemName });

            if (armorItems.length === 0) {
              return {
                content: [
                  {
                    type: "text" as const,
                    text: "No armor found matching your criteria.",
                  },
                ],
              };
            }

            let response = `# Armor\n\n`;
            response += `| Name | Thresholds (Major/Severe) | Armor Score | Feature |\n`;
            response += `|------|---------------------------|-------------|--------|\n`;

            for (const armor of armorItems) {
              response += `| ${armor.name} | ${armor.thresholds.major}/${armor.thresholds.severe} | ${armor.score} | ${armor.feature || "-"} |\n`;
            }

            return {
              content: [
                {
                  type: "text" as const,
                  text: response,
                },
              ],
            };
          }
        }

        case "lookup_mechanic": {
          const mechanic = args?.mechanic as string;
          const content = await rulesLoader.getMechanic(mechanic);

          return {
            content: [
              {
                type: "text" as const,
                text: content,
              },
            ],
          };
        }

        case "get_domain_info": {
          const domainName = args?.domainName as string | undefined;
          const domains = await rulesLoader.getDomain(domainName);

          if (Array.isArray(domains)) {
            let response = `# Daggerheart Domains\n\n`;
            for (const domain of domains) {
              response += `## ${domain.name}\n`;
              response += `${domain.description}\n`;
              response += `**Classes:** ${domain.classes.join(", ")}\n\n`;
            }
            return {
              content: [
                {
                  type: "text" as const,
                  text: response,
                },
              ],
            };
          } else {
            const domain = domains;
            let response = `# ${domain.name}\n\n`;
            response += `${domain.description}\n\n`;
            response += `**Classes with access:** ${domain.classes.join(", ")}\n`;

            return {
              content: [
                {
                  type: "text" as const,
                  text: response,
                },
              ],
            };
          }
        }

        case "list_options": {
          const category = args?.category as string;

          let options: string[] = [];
          let title = "";

          switch (category) {
            case "classes":
              options = await rulesLoader.getAllClasses();
              title = "Available Classes";
              break;
            case "ancestries":
              options = await rulesLoader.getAllAncestries();
              title = "Available Ancestries";
              break;
            case "communities":
              options = await rulesLoader.getAllCommunities();
              title = "Available Communities";
              break;
            case "domains":
              const domains = (await rulesLoader.getDomain()) as { name: string }[];
              options = domains.map((d) => d.name);
              title = "Available Domains";
              break;
          }

          return {
            content: [
              {
                type: "text" as const,
                text: `# ${title}\n\n${options.map((o) => `- ${o}`).join("\n")}`,
              },
            ],
          };
        }

        default:
          return {
            content: [
              {
                type: "text" as const,
                text: `Unknown tool: ${name}`,
              },
            ],
            isError: true,
          };
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Error: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  });

  // List resources
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
      resources: [
        {
          uri: "daggerheart://rules/introduction",
          name: "Introduction & Basics",
          mimeType: "text/plain",
        },
        {
          uri: "daggerheart://rules/character-creation",
          name: "Character Creation",
          mimeType: "text/plain",
        },
        {
          uri: "daggerheart://rules/core-mechanics",
          name: "Core Mechanics",
          mimeType: "text/plain",
        },
        {
          uri: "daggerheart://rules/classes",
          name: "Classes",
          mimeType: "text/plain",
        },
        {
          uri: "daggerheart://rules/ancestries",
          name: "Ancestries",
          mimeType: "text/plain",
        },
        {
          uri: "daggerheart://rules/communities",
          name: "Communities",
          mimeType: "text/plain",
        },
        {
          uri: "daggerheart://rules/domains",
          name: "Domains",
          mimeType: "text/plain",
        },
        {
          uri: "daggerheart://rules/equipment",
          name: "Equipment",
          mimeType: "text/plain",
        },
        {
          uri: "daggerheart://rules/adversaries",
          name: "Adversaries",
          mimeType: "text/plain",
        },
        {
          uri: "daggerheart://rules/gm-guidance",
          name: "GM Guidance",
          mimeType: "text/plain",
        },
      ],
    };
  });

  // Read resources
  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const uri = request.params.uri;
    const db = await rulesLoader.loadAllRules();

    const resourceMap: Record<string, string> = {
      "daggerheart://rules/introduction": db.introduction,
      "daggerheart://rules/character-creation": db.characterCreation,
      "daggerheart://rules/core-mechanics": db.coreMechanics,
      "daggerheart://rules/classes":
        db.rawFiles.get("DH_Rules_Classes.txt") || "",
      "daggerheart://rules/ancestries":
        db.rawFiles.get("DH_Rules_Ancestries.txt") || "",
      "daggerheart://rules/communities":
        db.rawFiles.get("DH_Rules_Communities.txt") || "",
      "daggerheart://rules/domains":
        db.rawFiles.get("DH_Rules_Domains.txt") || "",
      "daggerheart://rules/equipment":
        db.rawFiles.get("DH_Rules_Equipment.txt") || "",
      "daggerheart://rules/adversaries": db.adversaries,
      "daggerheart://rules/gm-guidance": db.gmGuidance,
    };

    const content = resourceMap[uri];

    if (!content) {
      throw new Error(`Resource not found: ${uri}`);
    }

    return {
      contents: [
        {
          uri,
          mimeType: "text/plain",
          text: content,
        },
      ],
    };
  });

  // Start the server
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error("Daggerheart MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
