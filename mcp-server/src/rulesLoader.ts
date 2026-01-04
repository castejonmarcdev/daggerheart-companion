import * as fs from "fs";
import * as path from "path";

// Type definitions for parsed rules data
export interface ClassData {
  name: string;
  description: string;
  domains: [string, string];
  startingEvasion: number;
  startingHP: number;
  classItems: string;
  hopeFeature: { name: string; description: string };
  classFeatures: { name: string; description: string }[];
  subclasses: SubclassData[];
}

export interface SubclassData {
  name: string;
  spellcastTrait: string;
  features: { name: string; description: string; type?: string }[];
}

export interface AncestryData {
  name: string;
  description: string;
  features: { name: string; description: string }[];
}

export interface CommunityData {
  name: string;
  description: string;
  adjectives: string[];
  feature: { name: string; description: string };
}

export interface DomainData {
  name: string;
  description: string;
  classes: string[];
}

export interface WeaponData {
  name: string;
  tier: number;
  category: "primary" | "secondary";
  trait: string;
  range: string;
  damage: string;
  damageType: "phy" | "mag";
  burden: string;
  feature?: string;
}

export interface ArmorData {
  name: string;
  tier: number;
  thresholds: { major: number; severe: number };
  score: number;
  feature?: string;
}

export interface MechanicData {
  name: string;
  category: string;
  content: string;
}

export interface RulesDatabase {
  introduction: string;
  characterCreation: string;
  coreMechanics: string;
  gmGuidance: string;
  adversaries: string;
  classes: ClassData[];
  ancestries: AncestryData[];
  communities: CommunityData[];
  domains: DomainData[];
  weapons: WeaponData[];
  armor: ArmorData[];
  mechanics: MechanicData[];
  rawFiles: Map<string, string>;
}

export class RulesLoader {
  private rulesPath: string;
  private cache: RulesDatabase | null = null;

  constructor(rulesPath: string) {
    this.rulesPath = rulesPath;
  }

  async loadAllRules(): Promise<RulesDatabase> {
    if (this.cache) {
      return this.cache;
    }

    const rawFiles = new Map<string, string>();

    // Read all rules files
    const files = [
      "DH_Rules_Introduction.txt",
      "DH_Rules_CharacterCreation.txt",
      "DH_Rules_CoreMechanics.txt",
      "DH_Rules_Classes.txt",
      "DH_Rules_Ancestries.txt",
      "DH_Rules_Communities.txt",
      "DH_Rules_Domains.txt",
      "DH_Rules_Equipment.txt",
      "DH_Rules_Adversaries.txt",
      "DH_Rules_GMGuidance.txt",
    ];

    for (const file of files) {
      const filePath = path.join(this.rulesPath, file);
      try {
        const content = fs.readFileSync(filePath, "utf-8");
        rawFiles.set(file, content);
      } catch (error) {
        console.error(`Error reading ${file}:`, error);
      }
    }

    // Parse structured data
    const classes = this.parseClasses(
      rawFiles.get("DH_Rules_Classes.txt") || ""
    );
    const ancestries = this.parseAncestries(
      rawFiles.get("DH_Rules_Ancestries.txt") || ""
    );
    const communities = this.parseCommunities(
      rawFiles.get("DH_Rules_Communities.txt") || ""
    );
    const domains = this.parseDomains(
      rawFiles.get("DH_Rules_Domains.txt") || ""
    );
    const { weapons, armor } = this.parseEquipment(
      rawFiles.get("DH_Rules_Equipment.txt") || ""
    );
    const mechanics = this.parseMechanics(
      rawFiles.get("DH_Rules_CoreMechanics.txt") || ""
    );

    this.cache = {
      introduction: rawFiles.get("DH_Rules_Introduction.txt") || "",
      characterCreation: rawFiles.get("DH_Rules_CharacterCreation.txt") || "",
      coreMechanics: rawFiles.get("DH_Rules_CoreMechanics.txt") || "",
      gmGuidance: rawFiles.get("DH_Rules_GMGuidance.txt") || "",
      adversaries: rawFiles.get("DH_Rules_Adversaries.txt") || "",
      classes,
      ancestries,
      communities,
      domains,
      weapons,
      armor,
      mechanics,
      rawFiles,
    };

    return this.cache;
  }

  private parseClasses(content: string): ClassData[] {
    const classes: ClassData[] = [];
    const sections = content.split(
      /={80}/
    );

    for (const section of sections) {
      const trimmed = section.trim();
      if (!trimmed || trimmed === "CLASSES" || trimmed.startsWith("A class is")) {
        continue;
      }

      const lines = trimmed.split("\n").map((l) => l.trim());
      const name = lines[0];

      if (
        ![
          "BARD",
          "DRUID",
          "GUARDIAN",
          "RANGER",
          "ROGUE",
          "SERAPH",
          "SORCERER",
          "WARRIOR",
          "WIZARD",
        ].includes(name)
      ) {
        continue;
      }

      // Parse class data
      const description =
        lines[1] ||
        `${name.charAt(0) + name.slice(1).toLowerCase()} class description`;

      // Extract domains
      const domainsLine = lines.find((l) => l.startsWith("DOMAINS:"));
      const domains = domainsLine
        ? (domainsLine.replace("DOMAINS:", "").trim().split(" & ") as [
            string,
            string
          ])
        : (["Unknown", "Unknown"] as [string, string]);

      // Extract starting stats
      const evasionLine = lines.find((l) => l.startsWith("STARTING EVASION:"));
      const startingEvasion = evasionLine
        ? parseInt(evasionLine.replace("STARTING EVASION:", "").trim())
        : 10;

      const hpLine = lines.find((l) => l.startsWith("STARTING HIT POINTS:"));
      const startingHP = hpLine
        ? parseInt(hpLine.replace("STARTING HIT POINTS:", "").trim())
        : 6;

      const itemsLine = lines.find((l) => l.startsWith("CLASS ITEMS:"));
      const classItems = itemsLine
        ? itemsLine.replace("CLASS ITEMS:", "").trim()
        : "";

      // Parse Hope feature
      const hopeFeatureIdx = lines.findIndex((l) =>
        l.includes("HOPE FEATURE")
      );
      let hopeFeature = { name: "", description: "" };
      if (hopeFeatureIdx !== -1 && lines[hopeFeatureIdx + 1]) {
        const hopeLine = lines[hopeFeatureIdx + 1];
        const colonIdx = hopeLine.indexOf(":");
        if (colonIdx !== -1) {
          hopeFeature = {
            name: hopeLine.substring(0, colonIdx).trim(),
            description: hopeLine.substring(colonIdx + 1).trim(),
          };
        }
      }

      // Parse class features
      const classFeatures: { name: string; description: string }[] = [];
      const classFeatureIdx = lines.findIndex(
        (l) => l === "CLASS FEATURE" || l === "CLASS FEATURES"
      );
      if (classFeatureIdx !== -1) {
        for (let i = classFeatureIdx + 1; i < lines.length; i++) {
          const line = lines[i];
          if (
            line.startsWith("SUBCLASS") ||
            line.includes("HOPE FEATURE") ||
            line === ""
          ) {
            break;
          }
          if (line.startsWith("-") || line.startsWith("•")) {
            const featureLine = line.replace(/^[-•]\s*/, "");
            const colonIdx = featureLine.indexOf(":");
            if (colonIdx !== -1) {
              classFeatures.push({
                name: featureLine.substring(0, colonIdx).trim(),
                description: featureLine.substring(colonIdx + 1).trim(),
              });
            }
          } else if (line.includes(":")) {
            const colonIdx = line.indexOf(":");
            classFeatures.push({
              name: line.substring(0, colonIdx).trim(),
              description: line.substring(colonIdx + 1).trim(),
            });
          }
        }
      }

      // Parse subclasses
      const subclasses: SubclassData[] = [];
      const subclassLine = lines.find((l) => l.startsWith("SUBCLASSES:"));
      if (subclassLine) {
        const subclassNames = subclassLine
          .replace("SUBCLASSES:", "")
          .trim()
          .split(" or ");

        for (const subName of subclassNames) {
          const subclassIdx = lines.findIndex(
            (l) => l.startsWith(subName.toUpperCase()) && l.includes("(")
          );

          let spellcastTrait = "";
          const features: { name: string; description: string; type?: string }[] = [];

          if (subclassIdx !== -1) {
            const spellcastMatch = lines[subclassIdx].match(
              /\(Spellcast:\s*(\w+)\)/
            );
            spellcastTrait = spellcastMatch ? spellcastMatch[1] : "";

            // Parse subclass features
            for (let i = subclassIdx + 1; i < lines.length; i++) {
              const line = lines[i];
              if (
                line.startsWith(subclassNames[1]?.toUpperCase() || "ZZZZZ") ||
                line === "" ||
                line.startsWith("=")
              ) {
                break;
              }
              if (line.startsWith("-") || line.startsWith("•")) {
                const featureLine = line.replace(/^[-•]\s*/, "");
                const colonIdx = featureLine.indexOf(":");
                if (colonIdx !== -1) {
                  const featureName = featureLine.substring(0, colonIdx).trim();
                  let type: string | undefined;
                  if (featureName.includes("(Specialization)")) {
                    type = "specialization";
                  } else if (featureName.includes("(Mastery)")) {
                    type = "mastery";
                  }
                  features.push({
                    name: featureName
                      .replace("(Specialization)", "")
                      .replace("(Mastery)", "")
                      .trim(),
                    description: featureLine.substring(colonIdx + 1).trim(),
                    type,
                  });
                }
              }
            }
          }

          subclasses.push({
            name: subName.trim(),
            spellcastTrait,
            features,
          });
        }
      }

      classes.push({
        name: name.charAt(0) + name.slice(1).toLowerCase(),
        description,
        domains,
        startingEvasion,
        startingHP,
        classItems,
        hopeFeature,
        classFeatures,
        subclasses,
      });
    }

    return classes;
  }

  private parseAncestries(content: string): AncestryData[] {
    const ancestries: AncestryData[] = [];
    const sections = content.split(/={80}/);

    const ancestryNames = [
      "CLANK",
      "DRAKONA",
      "DWARF",
      "ELF",
      "FAERIE",
      "FAUN",
      "FIRBOLG",
      "FUNGRIL",
      "GALAPA",
      "GIANT",
      "GOBLIN",
      "HALFLING",
      "HUMAN",
      "INFERNIS",
      "KATARI",
      "ORC",
      "RIBBET",
      "SIMIAH",
      "MIXED ANCESTRY",
    ];

    for (const section of sections) {
      const trimmed = section.trim();
      if (!trimmed) continue;

      const lines = trimmed.split("\n").map((l) => l.trim());
      const name = lines[0];

      if (!ancestryNames.includes(name)) continue;

      // Get description (all text before ANCESTRY FEATURES)
      const featuresIdx = lines.findIndex((l) =>
        l.startsWith("ANCESTRY FEATURES")
      );
      const description =
        featuresIdx > 1 ? lines.slice(1, featuresIdx).join(" ").trim() : "";

      // Parse features
      const features: { name: string; description: string }[] = [];
      if (featuresIdx !== -1) {
        for (let i = featuresIdx + 1; i < lines.length; i++) {
          const line = lines[i];
          if (line.startsWith("-") || line.startsWith("•")) {
            const featureLine = line.replace(/^[-•]\s*/, "");
            const colonIdx = featureLine.indexOf(":");
            if (colonIdx !== -1) {
              features.push({
                name: featureLine.substring(0, colonIdx).trim(),
                description: featureLine.substring(colonIdx + 1).trim(),
              });
            }
          }
        }
      }

      ancestries.push({
        name: name
          .split(" ")
          .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
          .join(" "),
        description,
        features,
      });
    }

    return ancestries;
  }

  private parseCommunities(content: string): CommunityData[] {
    const communities: CommunityData[] = [];
    const sections = content.split(/={80}/);

    const communityNames = [
      "HIGHBORNE",
      "LOREBORNE",
      "ORDERBORNE",
      "RIDGEBORNE",
      "SEABORNE",
      "SLYBORNE",
      "UNDERBORNE",
      "WANDERBORNE",
      "WILDBORNE",
    ];

    for (const section of sections) {
      const trimmed = section.trim();
      if (!trimmed) continue;

      const lines = trimmed.split("\n").map((l) => l.trim());
      const name = lines[0];

      if (!communityNames.includes(name)) continue;

      // Get description
      const adjectivesIdx = lines.findIndex(
        (l) => l.includes("are often:") || l.includes("are often :")
      );
      const description =
        adjectivesIdx > 1 ? lines.slice(1, adjectivesIdx).join(" ").trim() : "";

      // Parse adjectives
      let adjectives: string[] = [];
      if (adjectivesIdx !== -1) {
        const adjLine = lines[adjectivesIdx];
        const afterColon = adjLine.split(":")[1];
        if (afterColon) {
          adjectives = afterColon
            .split(",")
            .map((a) => a.replace("and", "").trim())
            .filter((a) => a.length > 0);
        }
      }

      // Parse community feature
      const featureIdx = lines.findIndex((l) =>
        l.startsWith("COMMUNITY FEATURE")
      );
      let feature = { name: "", description: "" };
      if (featureIdx !== -1 && lines[featureIdx + 1]) {
        const featureLine = lines[featureIdx + 1];
        const colonIdx = featureLine.indexOf(":");
        if (colonIdx !== -1) {
          feature = {
            name: featureLine.substring(0, colonIdx).trim(),
            description: featureLine.substring(colonIdx + 1).trim(),
          };
        }
      }

      communities.push({
        name: name.charAt(0) + name.slice(1).toLowerCase(),
        description,
        adjectives,
        feature,
      });
    }

    return communities;
  }

  private parseDomains(content: string): DomainData[] {
    const domains: DomainData[] = [];
    const lines = content.split("\n").map((l) => l.trim());

    const domainDefs = [
      {
        name: "Arcana",
        classes: ["Druid", "Sorcerer"],
      },
      {
        name: "Blade",
        classes: ["Guardian", "Warrior"],
      },
      {
        name: "Bone",
        classes: ["Ranger", "Warrior"],
      },
      {
        name: "Codex",
        classes: ["Bard", "Wizard"],
      },
      {
        name: "Grace",
        classes: ["Bard", "Rogue"],
      },
      {
        name: "Midnight",
        classes: ["Rogue", "Sorcerer"],
      },
      {
        name: "Sage",
        classes: ["Druid", "Ranger"],
      },
      {
        name: "Splendor",
        classes: ["Seraph", "Wizard"],
      },
      {
        name: "Valor",
        classes: ["Guardian", "Seraph"],
      },
    ];

    for (const def of domainDefs) {
      // Find description in content
      const domainIdx = lines.findIndex(
        (l) => l.toUpperCase() === def.name.toUpperCase()
      );
      let description = "";
      if (domainIdx !== -1 && lines[domainIdx + 1]) {
        description = lines[domainIdx + 1];
      }

      domains.push({
        name: def.name,
        description,
        classes: def.classes,
      });
    }

    return domains;
  }

  private parseEquipment(content: string): {
    weapons: WeaponData[];
    armor: ArmorData[];
  } {
    const weapons: WeaponData[] = [];
    const armor: ArmorData[] = [];

    // Parse weapons from table format
    const weaponMatches = content.matchAll(
      /\|\s*([^|]+)\s*\|\s*(\w+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]*)\s*\|/g
    );

    for (const match of weaponMatches) {
      const [, name, trait, range, damage, burden, feature] = match;
      if (
        name.trim() === "Name" ||
        name.includes("---") ||
        name.trim() === ""
      )
        continue;

      const dmgMatch = damage.trim().match(/d(\d+)([+-]\d+)?\s*(phy|mag)?/);
      if (!dmgMatch) continue;

      const isPrimary = content
        .substring(0, content.indexOf(name))
        .includes("PRIMARY");

      weapons.push({
        name: name.trim(),
        tier: 1,
        category: isPrimary ? "primary" : "secondary",
        trait: trait.trim(),
        range: range.trim(),
        damage: damage.trim(),
        damageType: damage.includes("mag") ? "mag" : "phy",
        burden: burden.trim(),
        feature: feature.trim() || undefined,
      });
    }

    // Parse armor
    const armorMatches = content.matchAll(
      /\|\s*([^|]+)\s*\|\s*(\d+)\s*\/\s*(\d+)\s*\|\s*(\d+)\s*\|\s*([^|]*)\s*\|/g
    );

    for (const match of armorMatches) {
      const [, name, major, severe, score, feature] = match;
      if (name.trim() === "Name" || name.includes("---")) continue;

      armor.push({
        name: name.trim(),
        tier: 1,
        thresholds: {
          major: parseInt(major),
          severe: parseInt(severe),
        },
        score: parseInt(score),
        feature: feature.trim() || undefined,
      });
    }

    return { weapons, armor };
  }

  private parseMechanics(content: string): MechanicData[] {
    const mechanics: MechanicData[] = [];
    const sections = content.split(/={80}/);

    for (const section of sections) {
      const trimmed = section.trim();
      if (!trimmed) continue;

      const lines = trimmed.split("\n");
      const title = lines[0].trim();

      if (title === "CORE MECHANICS" || title === "") continue;

      mechanics.push({
        name: title,
        category: this.categorizeSection(title),
        content: trimmed,
      });
    }

    return mechanics;
  }

  private categorizeSection(title: string): string {
    const categories: Record<string, string[]> = {
      gameplay: ["FLOW OF THE GAME"],
      rolls: ["ACTION ROLLS", "SPECIAL ROLLS"],
      resources: ["HOPE & FEAR"],
      combat: ["COMBAT", "MAPS, RANGE, AND MOVEMENT", "CONDITIONS"],
      downtime: ["DOWNTIME"],
      death: ["DEATH"],
      progression: ["LEVELING UP", "ADDITIONAL RULES"],
    };

    for (const [category, titles] of Object.entries(categories)) {
      if (titles.includes(title)) {
        return category;
      }
    }

    return "general";
  }

  // Search methods
  async searchRules(
    query: string,
    category?: string
  ): Promise<{ section: string; content: string; relevance: number }[]> {
    const db = await this.loadAllRules();
    const results: { section: string; content: string; relevance: number }[] =
      [];
    const queryLower = query.toLowerCase();
    const queryTerms = queryLower.split(/\s+/);

    // Search raw files
    for (const [filename, content] of db.rawFiles) {
      // Apply category filter if specified
      if (category && category !== "all") {
        const categoryMap: Record<string, string[]> = {
          mechanics: ["CoreMechanics"],
          classes: ["Classes"],
          ancestries: ["Ancestries"],
          communities: ["Communities"],
          equipment: ["Equipment"],
          combat: ["CoreMechanics", "Adversaries"],
          gm: ["GMGuidance", "Adversaries"],
        };
        const allowedFiles = categoryMap[category] || [];
        if (
          allowedFiles.length > 0 &&
          !allowedFiles.some((f) => filename.includes(f))
        ) {
          continue;
        }
      }

      // Split content into sections
      const sections = content.split(/={80}/);

      for (const section of sections) {
        const trimmed = section.trim();
        if (!trimmed) continue;

        const sectionLower = trimmed.toLowerCase();

        // Calculate relevance score
        let relevance = 0;
        for (const term of queryTerms) {
          const matches = (sectionLower.match(new RegExp(term, "g")) || [])
            .length;
          relevance += matches;
        }

        if (relevance > 0) {
          const lines = trimmed.split("\n");
          const sectionTitle = lines[0].trim();

          results.push({
            section: sectionTitle,
            content: trimmed.substring(0, 1500) + (trimmed.length > 1500 ? "..." : ""),
            relevance,
          });
        }
      }
    }

    // Sort by relevance
    results.sort((a, b) => b.relevance - a.relevance);

    return results.slice(0, 5);
  }

  async getClass(className: string): Promise<ClassData | null> {
    const db = await this.loadAllRules();
    return (
      db.classes.find(
        (c) => c.name.toLowerCase() === className.toLowerCase()
      ) || null
    );
  }

  async getAncestry(ancestryName: string): Promise<AncestryData | null> {
    const db = await this.loadAllRules();
    return (
      db.ancestries.find(
        (a) => a.name.toLowerCase() === ancestryName.toLowerCase()
      ) || null
    );
  }

  async getCommunity(communityName: string): Promise<CommunityData | null> {
    const db = await this.loadAllRules();
    return (
      db.communities.find(
        (c) => c.name.toLowerCase() === communityName.toLowerCase()
      ) || null
    );
  }

  async getDomain(domainName?: string): Promise<DomainData | DomainData[]> {
    const db = await this.loadAllRules();
    if (domainName) {
      return (
        db.domains.find(
          (d) => d.name.toLowerCase() === domainName.toLowerCase()
        ) || db.domains
      );
    }
    return db.domains;
  }

  async getWeapons(options?: {
    tier?: number;
    category?: "primary" | "secondary";
    name?: string;
  }): Promise<WeaponData[]> {
    const db = await this.loadAllRules();
    let weapons = db.weapons;

    if (options?.tier) {
      weapons = weapons.filter((w) => w.tier === options.tier);
    }
    if (options?.category) {
      weapons = weapons.filter((w) => w.category === options.category);
    }
    if (options?.name) {
      weapons = weapons.filter((w) =>
        w.name.toLowerCase().includes(options.name!.toLowerCase())
      );
    }

    return weapons;
  }

  async getArmor(options?: {
    tier?: number;
    name?: string;
  }): Promise<ArmorData[]> {
    const db = await this.loadAllRules();
    let armor = db.armor;

    if (options?.tier) {
      armor = armor.filter((a) => a.tier === options.tier);
    }
    if (options?.name) {
      armor = armor.filter((a) =>
        a.name.toLowerCase().includes(options.name!.toLowerCase())
      );
    }

    return armor;
  }

  async getMechanic(mechanicName: string): Promise<string> {
    const db = await this.loadAllRules();

    // Map common mechanic names to section content
    const mechanicMap: Record<string, string> = {
      duality_dice:
        "DUALITY DICE:\nAll action rolls require a pair of d12s called Duality Dice - one representing Hope and one representing Fear.",
      action_roll: db.mechanics.find((m) => m.name === "ACTION ROLLS")?.content || "",
      hope: db.mechanics.find((m) => m.name === "HOPE & FEAR")?.content || "",
      fear: db.mechanics.find((m) => m.name === "HOPE & FEAR")?.content || "",
      evasion: "EVASION:\nRepresents ability to avoid attacks. Any roll made against a PC has Difficulty equal to the target's Evasion.",
      stress: "STRESS:\nRepresents mental, physical, and emotional strain. Every PC starts with 6 Stress slots.",
      hit_points: "HIT POINTS & DAMAGE THRESHOLDS:\nHit Points (HP) represent ability to withstand physical injury.",
      damage_thresholds: "DAMAGE THRESHOLDS:\n- SEVERE: Damage at or above Severe threshold = mark 3 HP\n- MAJOR: Damage at or above Major threshold but below Severe = mark 2 HP\n- MINOR: Damage below Major threshold = mark 1 HP",
      attack: db.mechanics.find((m) => m.name === "COMBAT")?.content || "",
      critical_success: "CRITICAL SUCCESS:\nDuality Dice show matching results. You automatically succeed with a bonus, gain a Hope, and clear a Stress.",
      advantage: "ADVANTAGE & DISADVANTAGE:\n- Advantage: Roll a d6 and add its result to your total.\n- Disadvantage: Roll a d6 and subtract its result from your total.",
      disadvantage: "ADVANTAGE & DISADVANTAGE:\n- Advantage: Roll a d6 and add its result to your total.\n- Disadvantage: Roll a d6 and subtract its result from your total.",
      conditions: db.mechanics.find((m) => m.name === "CONDITIONS")?.content || "",
      short_rest: db.mechanics.find((m) => m.name === "DOWNTIME")?.content || "",
      long_rest: db.mechanics.find((m) => m.name === "DOWNTIME")?.content || "",
      death: db.mechanics.find((m) => m.name === "DEATH")?.content || "",
      leveling_up: db.mechanics.find((m) => m.name === "LEVELING UP")?.content || "",
      multiclassing: "MULTICLASSING (available at Level 5+):\nChoose an additional class, gain access to one of its domains, acquire its class feature.",
      ranges: db.mechanics.find((m) => m.name === "MAPS, RANGE, AND MOVEMENT")?.content || "",
      armor_slots: "ARMOR SLOTS:\nWhen you take damage, you can mark one Armor Slot to reduce Hit Points marked by one.",
    };

    const key = mechanicName.toLowerCase().replace(/\s+/g, "_");
    return mechanicMap[key] || `Mechanic "${mechanicName}" not found.`;
  }

  async getAllClasses(): Promise<string[]> {
    const db = await this.loadAllRules();
    return db.classes.map((c) => c.name);
  }

  async getAllAncestries(): Promise<string[]> {
    const db = await this.loadAllRules();
    return db.ancestries.map((a) => a.name);
  }

  async getAllCommunities(): Promise<string[]> {
    const db = await this.loadAllRules();
    return db.communities.map((c) => c.name);
  }
}
