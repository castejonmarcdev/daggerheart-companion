// Embedded Daggerheart rules data for browser-side tool execution

interface ClassData {
  name: string;
  description: string;
  domains: [string, string];
  startingEvasion: number;
  startingHP: number;
  classItems: string;
  hopeFeature: { name: string; description: string };
  classFeatures: { name: string; description: string }[];
  subclasses: {
    name: string;
    spellcastTrait: string;
    features: { name: string; description: string; type?: string }[];
  }[];
}

interface AncestryData {
  name: string;
  description: string;
  features: { name: string; description: string }[];
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

export const rulesData = {
  sections: {
    introduction: `INTRODUCTION TO DAGGERHEART

Daggerheart is a fantasy tabletop roleplaying game with a focus on long-form campaigns and rich character progression. It uses a unique "Duality Dice" system where two d12s (Hope and Fear) are rolled together, creating dynamic outcomes based on which die shows higher.

THE GOLDEN RULE
Daggerheart is yours to make your own! Feel free to add, change, or remove rules that don't serve your story.

RULINGS OVER RULES
The GM has final say on how rules are interpreted. When in doubt, make a ruling and move on.

DUALITY DICE
The core mechanic uses two d12s - one Hope die and one Fear die. The outcome depends on both the total AND which die is higher.`,

    coreMechanics: `CORE MECHANICS

FLOW OF THE GAME
Daggerheart is a conversation. The GM describes scenarios, players describe reactions.

ACTION ROLLS
When success isn't guaranteed and failure would be interesting, roll the Duality Dice.
1. Pick the appropriate trait
2. Determine the Difficulty
3. Apply modifiers
4. Roll and announce as "[total] with [Hope/Fear]"

OUTCOMES:
- SUCCESS WITH HOPE: Meet difficulty + Hope higher = succeed + gain Hope
- SUCCESS WITH FEAR: Meet difficulty + Fear higher = succeed with cost, GM gains Fear
- FAILURE WITH HOPE: Miss difficulty + Hope higher = fail with minor consequence, gain Hope
- FAILURE WITH FEAR: Miss difficulty + Fear higher = fail with major consequence, GM gains Fear
- CRITICAL SUCCESS: Matching dice = auto-succeed + bonus + gain Hope + clear Stress

HOPE & FEAR
Players start with 2 Hope (max 6). GM accumulates Fear (max 12).
Hope is spent on: helping allies, utilizing experiences, tag team rolls, Hope features.
Fear is spent on: GM moves and Fear features.

COMBAT
- Evasion: Difficulty to hit a PC
- Stress: Mental/physical strain (6 slots)
- Hit Points: Physical injury
- Damage Thresholds: Minor/Major/Severe based on armor + level`,

    classes: `DAGGERHEART CLASSES

There are 9 classes, each with 2 domains and 2 subclasses:

BARD (Grace & Codex): Masters of captivation and performance
DRUID (Sage & Arcana): Protectors of wilderness magic, can transform
GUARDIAN (Valor & Blade): Fierce defenders of their cohort
RANGER (Bone & Sage): Skilled hunters and sly tacticians
ROGUE (Midnight & Grace): Scoundrels with sharp wits and blades
SERAPH (Splendor & Valor): Divine fighters and healers
SORCERER (Arcana & Midnight): Controllers of innate magical power
WARRIOR (Blade & Bone): Masters of weapons through training
WIZARD (Codex & Splendor): Acquirers of magical power through study`,

    ancestries: `DAGGERHEART ANCESTRIES

18 ancestries available, each with 2 features:

CLANK: Sentient mechanical beings
DRAKONA: Wingless dragon humanoids with elemental breath
DWARF: Short humanoids with thick skin
ELF: Tall humanoids with pointed ears and celestial trance
FAERIE: Winged humanoids with insectile features
FAUN: Goat-like humanoids with horns
FIRBOLG: Bovine humanoids with remarkable strength
FUNGRIL: Humanoid mushrooms with mycelial communication
GALAPA: Anthropomorphic turtles with protective shells
GIANT: Towering humanoids with 1-3 eyes
GOBLIN: Small humanoids with large eyes and ears
HALFLING: Small humanoids with internal compass
HUMAN: Adaptable humanoids with high stamina
INFERNIS: Demon-descended humanoids with dread visage
KATARI: Feline humanoids with retractable claws
ORC: Humanoids with tusks and sturdy nature
RIBBET: Anthropomorphic frogs, amphibious
SIMIAH: Anthropomorphic monkeys/apes, natural climbers`,

    communities: `DAGGERHEART COMMUNITIES

9 communities that shaped your character:

HIGHBORNE: Life of elegance and prestige (Privilege feature)
LOREBORNE: Society favoring academic prowess (Well-Read feature)
ORDERBORNE: Collective focused on discipline/faith (Dedicated feature)
RIDGEBORNE: Mountain dwellers (Steady feature)
SEABORNE: Water-based communities (Know the Tide feature)
SLYBORNE: Operates outside the law (Scoundrel feature)
UNDERBORNE: Subterranean society (Low-Light Living feature)
WANDERBORNE: Nomadic lifestyle (Nomadic Pack feature)
WILDBORNE: Deep forest dwellers (Lightfoot feature)`,

    equipment: `DAGGERHEART EQUIPMENT

WEAPONS have: tier, trait, range, damage, burden, and optional features.
Categories: Primary (main weapon) and Secondary (off-hand/backup)

ARMOR provides: damage thresholds and Armor Slots
Mark Armor Slots to reduce HP marked by 1

DAMAGE THRESHOLDS:
- Minor: Below Major threshold = 1 HP
- Major: At/above Major, below Severe = 2 HP
- Severe: At/above Severe = 3 HP`,

    gmGuidance: `GM GUIDANCE

GM PRINCIPLES:
- Begin and end with the fiction
- Collaborate with players
- Create wonder and discovery
- Ask questions

GM MOVES (soft and hard):
- Reveal an unwelcome truth
- Show signs of approaching danger
- Put someone in a spot
- Use their resources against them
- Deal damage
- Introduce a new threat`,

    adversaries: `ADVERSARIES

Adversary types: Bruisers, Hordes, Leaders, Minions, Ranged, Skulks, Socials, Solos, Standards, Supports

Building encounters uses Battle Points based on party level and composition.

Tiers 1-4 with scaling difficulty and HP.`,
  },

  classes: {
    bard: {
      name: 'Bard',
      description: 'Bards are masters of captivation and specialize in performance types including singing, playing instruments, weaving tales, or telling jokes. They thrive in social situations.',
      domains: ['Grace', 'Codex'] as [string, string],
      startingEvasion: 10,
      startingHP: 5,
      classItems: 'A romance novel or a letter never opened',
      hopeFeature: {
        name: 'Make a Scene',
        description: 'Spend 3 Hope to temporarily Distract a target within Close range, giving them a -2 penalty to their Difficulty.',
      },
      classFeatures: [
        {
          name: 'Rally',
          description: 'Once per session, describe how you rally the party and give yourself and each ally a Rally Die (d6 at level 1, d8 at level 5). A PC can spend their Rally Die to roll it, adding the result to their action roll, reaction roll, damage roll, or to clear Stress equal to the result.',
        },
      ],
      subclasses: [
        {
          name: 'Troubadour',
          spellcastTrait: 'Presence',
          features: [
            { name: 'Gifted Performer', description: 'Play three types of songs once each per long rest' },
            { name: 'Maestro', description: 'When you give a Rally Die to an ally, they can gain a Hope or clear a Stress', type: 'specialization' },
            { name: 'Virtuoso', description: 'Perform each song twice per long rest', type: 'mastery' },
          ],
        },
        {
          name: 'Wordsmith',
          spellcastTrait: 'Presence',
          features: [
            { name: 'Rousing Speech', description: 'Once per long rest, all allies within Far range clear 2 Stress' },
            { name: 'Heart of a Poet', description: 'Spend a Hope to add d4 to action rolls to impress/persuade/offend' },
            { name: 'Eloquent', description: 'Once per session, provide various aids to allies', type: 'specialization' },
            { name: 'Epic Poetry', description: 'Rally Die increases to d10', type: 'mastery' },
          ],
        },
      ],
    },
    druid: {
      name: 'Druid',
      description: 'Druids learn from and protect the magic of the wilderness. They can transform into beasts and shape nature itself.',
      domains: ['Sage', 'Arcana'] as [string, string],
      startingEvasion: 10,
      startingHP: 6,
      classItems: 'A small bag of rocks and bones or a strange pendant',
      hopeFeature: {
        name: 'Evolution',
        description: 'Spend 3 Hope to transform into Beastform without marking Stress. Choose one trait to raise by +1 until you drop out.',
      },
      classFeatures: [
        { name: 'Beastform', description: 'Mark a Stress to transform into a creature from the Beastform list' },
        { name: 'Wildtouch', description: 'Perform harmless nature effects at will' },
      ],
      subclasses: [
        {
          name: 'Warden of the Elements',
          spellcastTrait: 'Instinct',
          features: [
            { name: 'Elemental Incarnation', description: 'Channel Fire, Earth, Water, or Air with unique effects' },
            { name: 'Elemental Aura', description: 'Assume an aura matching your element', type: 'specialization' },
            { name: 'Elemental Dominion', description: 'Further embody your element', type: 'mastery' },
          ],
        },
        {
          name: 'Warden of Renewal',
          spellcastTrait: 'Instinct',
          features: [
            { name: 'Clarity of Nature', description: 'Create a space of serenity to clear Stress' },
            { name: 'Regeneration', description: 'Spend 3 Hope to clear 1d4 Hit Points on a touched creature' },
            { name: "Warden's Protection", description: 'Clear 2 HP on 1d4 allies', type: 'specialization' },
            { name: 'Defender', description: 'Reduce ally damage while in Beastform', type: 'mastery' },
          ],
        },
      ],
    },
    guardian: {
      name: 'Guardian',
      description: 'Guardians are known for fighting with remarkable ferocity even against overwhelming odds, defending their cohort above all else.',
      domains: ['Valor', 'Blade'] as [string, string],
      startingEvasion: 9,
      startingHP: 7,
      classItems: 'A totem from your mentor or a secret key',
      hopeFeature: {
        name: 'Frontline Tank',
        description: 'Spend 3 Hope to clear 2 Armor Slots.',
      },
      classFeatures: [
        {
          name: 'Unstoppable',
          description: 'Once per long rest, become Unstoppable with an Unstoppable Die (d4 at level 1, d6 at level 5). While Unstoppable: reduce physical damage severity by one threshold, add Unstoppable Die value to damage roll, can\'t be Restrained or Vulnerable.',
        },
      ],
      subclasses: [
        {
          name: 'Stalwart',
          spellcastTrait: '',
          features: [
            { name: 'Unwavering', description: '+1 to damage thresholds' },
            { name: 'Iron Will', description: 'Mark additional Armor Slot to reduce severity' },
            { name: 'Unrelenting', description: '+2 to damage thresholds', type: 'specialization' },
            { name: 'Undaunted', description: '+3 to damage thresholds, Loyal Protector', type: 'mastery' },
          ],
        },
        {
          name: 'Vengeance',
          spellcastTrait: '',
          features: [
            { name: 'At Ease', description: 'Additional Stress slot' },
            { name: 'Revenge', description: 'Mark 2 Stress to force attacker to mark a Hit Point' },
            { name: 'Act of Reprisal', description: '+1 Proficiency against damaging adversary', type: 'specialization' },
            { name: 'Nemesis', description: 'Prioritize an adversary for special benefits', type: 'mastery' },
          ],
        },
      ],
    },
    ranger: {
      name: 'Ranger',
      description: 'Rangers are highly skilled hunters who become sly tacticians, pursuing quarry with cunning and patience.',
      domains: ['Bone', 'Sage'] as [string, string],
      startingEvasion: 12,
      startingHP: 6,
      classItems: 'A trophy from your first kill or a seemingly broken compass',
      hopeFeature: {
        name: 'Hold Them Off',
        description: 'Spend 3 Hope when you succeed on an attack to use that roll against two additional adversaries.',
      },
      classFeatures: [
        {
          name: "Ranger's Focus",
          description: "Spend a Hope to make a target your Focus, gaining: know their precise direction, target must mark Stress when you deal damage, can reroll Duality Dice on failed attacks against them.",
        },
      ],
      subclasses: [
        {
          name: 'Beastbound',
          spellcastTrait: 'Agility',
          features: [
            { name: 'Companion', description: 'Animal companion that stays by your side' },
            { name: 'Expert Training', description: 'Additional level-up option for companion', type: 'specialization' },
            { name: 'Advanced Training', description: 'Two additional level-up options, Loyal Friend', type: 'mastery' },
          ],
        },
        {
          name: 'Wayfinder',
          spellcastTrait: 'Agility',
          features: [
            { name: 'Ruthless Predator', description: 'Mark Stress for +1 Proficiency' },
            { name: 'Path Forward', description: 'Identify shortest path to visited locations' },
            { name: 'Elusive Predator', description: '+2 Evasion against Focus attacks', type: 'specialization' },
            { name: 'Apex Predator', description: 'Remove Fear from GM pool on successful Focus attack', type: 'mastery' },
          ],
        },
      ],
    },
    rogue: {
      name: 'Rogue',
      description: 'Rogues are scoundrels who move through the world anonymously, utilizing sharp wits and blades.',
      domains: ['Midnight', 'Grace'] as [string, string],
      startingEvasion: 12,
      startingHP: 6,
      classItems: 'A set of forgery tools or a grappling hook',
      hopeFeature: {
        name: "Rogue's Dodge",
        description: 'Spend 3 Hope to gain +2 Evasion until attacked successfully or next rest.',
      },
      classFeatures: [
        { name: 'Cloaked', description: 'Enhanced Hidden condition' },
        { name: 'Sneak Attack', description: 'Add d6s equal to tier to damage while Cloaked or ally is near target' },
      ],
      subclasses: [
        {
          name: 'Nightwalker',
          spellcastTrait: 'Finesse',
          features: [
            { name: 'Shadow Stepper', description: 'Move from shadow to shadow, becoming Cloaked' },
            { name: 'Dark Cloud', description: 'Create temporary dark cloud', type: 'specialization' },
            { name: 'Fleeting Shadow', description: '+1 Evasion, extended Shadow Stepper range', type: 'mastery' },
          ],
        },
        {
          name: 'Syndicate',
          spellcastTrait: 'Finesse',
          features: [
            { name: 'Well-Connected', description: 'Know someone in every prominent location' },
            { name: 'Contacts Everywhere', description: 'Call on shady contacts once per session', type: 'specialization' },
            { name: 'Reliable Backup', description: 'Use contacts three times per session', type: 'mastery' },
          ],
        },
      ],
    },
    seraph: {
      name: 'Seraph',
      description: 'Seraphs are divine fighters and healers imbued with sacred purpose.',
      domains: ['Splendor', 'Valor'] as [string, string],
      startingEvasion: 9,
      startingHP: 7,
      classItems: 'A bundle of offerings or a sigil of your god',
      hopeFeature: {
        name: 'Life Support',
        description: 'Spend 3 Hope to clear a Hit Point on an ally within Close range.',
      },
      classFeatures: [
        {
          name: 'Prayer Dice',
          description: 'Roll d4s equal to Spellcast trait at session start. Spend to aid yourself or allies: reduce damage, add to rolls, or gain Hope.',
        },
      ],
      subclasses: [
        {
          name: 'Divine Wielder',
          spellcastTrait: 'Strength',
          features: [
            { name: 'Spirit Weapon', description: 'Equipped Melee/Very Close weapon can attack at Close range' },
            { name: 'Sparing Touch', description: 'Clear 2 HP or 2 Stress once per long rest' },
            { name: 'Devout', description: 'Roll extra Prayer Die, use Sparing Touch twice', type: 'specialization' },
            { name: 'Sacred Resonance', description: 'Double matching damage dice', type: 'mastery' },
          ],
        },
        {
          name: 'Winged Sentinel',
          spellcastTrait: 'Strength',
          features: [
            { name: 'Wings of Light', description: 'Fly, carry creatures, deal extra damage' },
            { name: 'Ethereal Visage', description: 'Advantage on Presence Rolls while flying', type: 'specialization' },
            { name: 'Ascendant', description: '+4 to Severe threshold', type: 'mastery' },
            { name: 'Power of the Gods', description: 'Deal 1d12 extra damage while flying', type: 'mastery' },
          ],
        },
      ],
    },
    sorcerer: {
      name: 'Sorcerer',
      description: 'Sorcerers cultivate and control innate magical power passed down through families.',
      domains: ['Arcana', 'Midnight'] as [string, string],
      startingEvasion: 10,
      startingHP: 6,
      classItems: 'A whispering orb or a family heirloom',
      hopeFeature: {
        name: 'Volatile Magic',
        description: 'Spend 3 Hope to reroll any damage dice on magic damage attacks.',
      },
      classFeatures: [
        { name: 'Arcane Sense', description: 'Sense magical people and objects within Close range' },
        { name: 'Minor Illusion', description: 'Create visual illusions within Close range' },
        { name: 'Channel Raw Power', description: 'Place domain card in vault to gain Hope or enhance damage' },
      ],
      subclasses: [
        {
          name: 'Elemental Origin',
          spellcastTrait: 'Instinct',
          features: [
            { name: 'Elementalist', description: 'Choose air, earth, fire, lightning, or water; shape element' },
            { name: 'Natural Evasion', description: 'Add d6 to Evasion against attacks', type: 'specialization' },
            { name: 'Transcendence', description: 'Transform into physical manifestation of element', type: 'mastery' },
          ],
        },
        {
          name: 'Primal Origin',
          spellcastTrait: 'Instinct',
          features: [
            { name: 'Manipulate Magic', description: 'Mark Stress after spells to extend reach, add bonuses, etc.' },
            { name: 'Enchanted Aid', description: 'Roll d8 when helping ally with Spellcast', type: 'specialization' },
            { name: 'Arcane Charge', description: 'Gather magical energy to enhance capabilities', type: 'mastery' },
          ],
        },
      ],
    },
    warrior: {
      name: 'Warrior',
      description: 'Warriors master weapons and violence through training and dedication, understanding the importance of an agile body and mind.',
      domains: ['Blade', 'Bone'] as [string, string],
      startingEvasion: 11,
      startingHP: 6,
      classItems: 'The drawing of a lover or a sharpening stone',
      hopeFeature: {
        name: 'No Mercy',
        description: 'Spend 3 Hope to gain +1 to attack rolls until next rest.',
      },
      classFeatures: [
        { name: 'Attack of Opportunity', description: 'Reaction roll when adversary attempts to leave Melee range' },
        { name: 'Combat Training', description: 'Ignore weapon burden, add level to physical damage rolls' },
      ],
      subclasses: [
        {
          name: 'Call of the Brave',
          spellcastTrait: '',
          features: [
            { name: 'Courage', description: 'Gain Hope when you fail with Fear' },
            { name: 'Battle Ritual', description: 'Clear 2 Stress and gain 2 Hope before dangerous situations' },
            { name: 'Rise to the Challenge', description: 'Roll d20 as Hope Die at 2 or fewer HP', type: 'specialization' },
            { name: 'Camaraderie', description: 'Extra Tag Team Roll, reduced cost for allies', type: 'mastery' },
          ],
        },
        {
          name: 'Call of the Slayer',
          spellcastTrait: '',
          features: [
            { name: 'Slayer', description: 'Pool of Slayer Dice to add to attack/damage rolls' },
            { name: 'Weapon Specialist', description: 'Add secondary weapon damage die', type: 'specialization' },
            { name: 'Martial Preparation', description: 'Party gains Martial Preparation downtime move', type: 'mastery' },
          ],
        },
      ],
    },
    wizard: {
      name: 'Wizard',
      description: 'Wizards acquire and hone magical power through years of learning using books, stones, potions, and herbs.',
      domains: ['Codex', 'Splendor'] as [string, string],
      startingEvasion: 11,
      startingHP: 5,
      classItems: 'A book you\'re trying to translate or a tiny, harmless elemental pet',
      hopeFeature: {
        name: 'Not This Time',
        description: 'Spend 3 Hope to force an adversary to reroll an attack or damage roll.',
      },
      classFeatures: [
        { name: 'Prestidigitation', description: 'Perform harmless magical effects at will' },
        { name: 'Strange Patterns', description: 'Choose a number 1-12; gain Hope or clear Stress when rolled' },
      ],
      subclasses: [
        {
          name: 'School of Knowledge',
          spellcastTrait: 'Knowledge',
          features: [
            { name: 'Prepared', description: 'Take additional domain card' },
            { name: 'Adept', description: 'Mark Stress instead of spending Hope to double Experience modifier' },
            { name: 'Accomplished', description: 'Another additional domain card', type: 'specialization' },
            { name: 'Brilliant', description: 'Another additional domain card, Honed Expertise', type: 'mastery' },
          ],
        },
        {
          name: 'School of War',
          spellcastTrait: 'Knowledge',
          features: [
            { name: 'Battlemage', description: 'Additional Hit Point slot' },
            { name: 'Face Your Fear', description: 'Deal extra 1d10 magic damage on success with Fear' },
            { name: 'Conjure Shield', description: 'Add Proficiency to Evasion with 2+ Hope', type: 'specialization' },
            { name: 'Have No Fear', description: 'Extra damage increases to 3d10', type: 'mastery' },
          ],
        },
      ],
    },
  } as Record<string, ClassData>,

  ancestries: {
    clank: {
      name: 'Clank',
      description: 'Clanks are sentient mechanical beings built from a variety of materials, including metal, wood, and stone. They can resemble humanoids, animals, or even inanimate objects. Their bodies come in a wide array of sizes. Because of their bespoke construction, many clanks have highly specialized physical configurations including clawed hands, wheels for movement, or built-in weaponry.',
      features: [
        { name: 'Purposeful Design', description: 'Decide who made you and for what purpose. At character creation, choose one of your Experiences that best aligns with this purpose and gain a permanent +1 bonus to it.' },
        { name: 'Efficient', description: 'When you take a short rest, you can choose a long rest move instead of a short rest move.' },
      ],
    },
    drakona: {
      name: 'Drakona',
      description: 'Drakona resemble wingless dragons in humanoid form and possess a powerful elemental breath. All drakona have thick scales that provide excellent natural armor. They are large in size, ranging from 5 feet to 7 feet on average, with long sharp teeth that grow throughout their approximately 350-year lifespan.',
      features: [
        { name: 'Scales', description: 'Your scales act as natural protection. When you would take Severe damage, you can mark a Stress to mark 1 fewer Hit Points.' },
        { name: 'Elemental Breath', description: 'Choose an element for your breath (such as electricity, fire, or ice). You can use this breath against a target or group of targets within Very Close range, treating it as an Instinct weapon that deals d8 magic damage using your Proficiency.' },
      ],
    },
    dwarf: {
      name: 'Dwarf',
      description: 'Dwarves are short humanoids with square frames, dense musculature, and thick hair. Their average height ranges from 4 to 5 1/2 feet. Their skin and nails contain high keratin, making them naturally resilient, allowing them to embed gemstones into their bodies. Dwarves of all genders can grow facial hair. Typically, dwarves live up to 250 years of age.',
      features: [
        { name: 'Thick Skin', description: 'When you take Minor damage, you can mark 2 Stress instead of marking a Hit Point.' },
        { name: 'Increased Fortitude', description: 'Spend 3 Hope to halve incoming physical damage.' },
      ],
    },
    elf: {
      name: 'Elf',
      description: 'Elves are typically tall humanoids with pointed ears and acutely attuned senses. Heights range from about 6 to 6 1/2 feet. All elves can drop into a celestial trance rather than sleep. Some elves possess a "mystic form" - physical changes from dedicating themselves to nature. Elves live for about 350 years.',
      features: [
        { name: 'Quick Reactions', description: 'Mark a Stress to gain advantage on a reaction roll.' },
        { name: 'Celestial Trance', description: 'During a rest, you can drop into a trance to choose an additional downtime move.' },
      ],
    },
    faerie: {
      name: 'Faerie',
      description: 'Faeries are winged humanoid creatures with insectile features. They possess characteristics ranging from additional arms, compound eyes, lantern organs, chitinous exoskeletons, or stingers. Average height ranges from 2 feet to 7 feet. All faeries possess membranous wings and go through metamorphosis. Lifespan is approximately 50 years.',
      features: [
        { name: 'Luckbender', description: 'Once per session, after you or a willing ally within Close range makes an action roll, you can spend 3 Hope to reroll the Duality Dice.' },
        { name: 'Wings', description: 'You can fly. While flying, you can mark a Stress after an adversary makes an attack against you to gain a +2 bonus to your Evasion against that attack.' },
      ],
    },
    faun: {
      name: 'Faun',
      description: 'Fauns resemble humanoid goats with curving horns, square pupils, and cloven hooves. Most have a humanoid torso and a goatlike lower body covered in dense fur. Heights range from 4 feet to 6 1/2 feet. Fauns live for roughly 225 years, and as they age, their appearance can become increasingly goatlike.',
      features: [
        { name: 'Caprine Leap', description: 'You can leap anywhere within Close range as though you were using normal movement, allowing you to vault obstacles, jump across gaps, or scale barriers with ease.' },
        { name: 'Kick', description: 'When you succeed on an attack against a target within Melee range, you can mark a Stress to kick yourself off them, dealing an extra 2d6 damage and knocking back either yourself or the target to Very Close range.' },
      ],
    },
    firbolg: {
      name: 'Firbolg',
      description: 'Firbolgs are bovine humanoids typically recognized by their broad noses and long, drooping ears. Some have heads that entirely resemble cattle (often referred to as minotaurs). They are tall and muscular, heights ranging from 5 feet to 7 feet. All firbolgs are covered in fur. On average, firbolgs live for about 150 years.',
      features: [
        { name: 'Charge', description: 'When you succeed on an Agility Roll to move from Far or Very Far range into Melee range with one or more targets, you can mark a Stress to deal 1d12 physical damage to all targets within Melee range.' },
        { name: 'Unshakable', description: 'When you would mark a Stress, roll a d6. On a result of 6, don\'t mark it.' },
      ],
    },
    fungril: {
      name: 'Fungril',
      description: 'Fungril resemble humanoid mushrooms. They come in an assortment of colors, from earth tones to bright reds, yellows, purples, and blues. Heights range from 2 feet to 7 feet. Common lifespan is about 300 years. They can communicate nonverbally and many use a mycelial array to chemically exchange information with other fungril across long distances.',
      features: [
        { name: 'Fungril Network', description: 'Make an Instinct Roll (12) to use your mycelial array to speak with others of your ancestry. On a success, you can communicate across any distance.' },
        { name: 'Death Connection', description: 'While touching a corpse that died recently, you can mark a Stress to extract one memory from the corpse related to a specific emotion or sensation of your choice.' },
      ],
    },
    galapa: {
      name: 'Galapa',
      description: 'Galapa resemble anthropomorphic turtles with large, domed shells into which they can retract. Height ranges from 4 feet to 6 feet. They can draw their head, arms, and legs into their shell for protection. Some supplement their shell\'s strength or appearance by attaching armor or carving unique designs. Most galapa move slowly and live approximately 150 years.',
      features: [
        { name: 'Shell', description: 'Gain a bonus to your damage thresholds equal to your Proficiency.' },
        { name: 'Retract', description: 'Mark a Stress to retract into your shell. While in your shell, you have resistance to physical damage, you have disadvantage on action rolls, and you can\'t move.' },
      ],
    },
    giant: {
      name: 'Giant',
      description: 'Giants are towering humanoids with broad shoulders, long arms, and one to three eyes. Adult giants range from 6 1/2 to 8 1/2 feet tall. They are born with no eyes and remain sightless for their first year. Those with a single eye are commonly known as cyclops. The average giant lifespan is about 75 years.',
      features: [
        { name: 'Endurance', description: 'Gain an additional Hit Point slot at character creation.' },
        { name: 'Reach', description: 'Treat any weapon, ability, spell, or other feature that has a Melee range as though it has a Very Close range instead.' },
      ],
    },
    goblin: {
      name: 'Goblin',
      description: 'Goblins are small humanoids recognizable by their large eyes and massive membranous ears. They perceive details at great distances and in darkness. A typical goblin stands between 3 feet and 4 feet tall. Goblins use ear positions for nonverbal communication. A goblin\'s lifespan is roughly 100 years.',
      features: [
        { name: 'Surefooted', description: 'You ignore disadvantage on Agility Rolls.' },
        { name: 'Danger Sense', description: 'Once per rest, mark a Stress to force an adversary to reroll an attack against you or an ally within Very Close range.' },
      ],
    },
    halfling: {
      name: 'Halfling',
      description: 'Halflings are small humanoids with large hairy feet and prominent rounded ears. Average height is 3 to 4 feet. Their ears, nose, and feet are larger in proportion to the rest of their body. They live around 150 years and remain youthful even in old age. Halflings are naturally attuned to magnetic fields, granting them a strong internal compass.',
      features: [
        { name: 'Luckbringer', description: 'At the start of each session, everyone in your party gains a Hope.' },
        { name: 'Internal Compass', description: 'When you roll a 1 on your Hope Die, you can reroll it.' },
      ],
    },
    human: {
      name: 'Human',
      description: 'Humans are recognized by their dexterous hands, rounded ears, and bodies built for endurance. Average height ranges from just under 5 feet to about 6 1/2 feet. Humans are physically adaptable and adjust to harsh climates with relative ease. Humans live to about 100 years.',
      features: [
        { name: 'High Stamina', description: 'Gain an additional Stress slot at character creation.' },
        { name: 'Adaptability', description: 'When you fail a roll that utilized one of your Experiences, you can mark a Stress to reroll.' },
      ],
    },
    infernis: {
      name: 'Infernis',
      description: 'Infernis are humanoids who possess sharp canine teeth, pointed ears, and horns. They are descendants of demons from the Circles Below. Height ranges from 5 feet to 7 feet. They have long fingers and pointed nails. Some have long, thin tails. Infernis possess a "dread visage" that manifests both involuntarily and purposefully. On average, infernis live up to 350 years.',
      features: [
        { name: 'Fearless', description: 'When you roll with Fear, you can mark 2 Stress to change it into a roll with Hope instead.' },
        { name: 'Dread Visage', description: 'You have advantage on rolls to intimidate hostile creatures.' },
      ],
    },
    katari: {
      name: 'Katari',
      description: 'Katari are feline humanoids with retractable claws, vertically slit pupils, and high, triangular ears. Their ears can swivel nearly 180 degrees. About half of the katari population have tails. Height ranges from 3 feet to 6 1/2 feet, and they live to around 150 years.',
      features: [
        { name: 'Feline Instincts', description: 'When you make an Agility Roll, you can spend 2 Hope to reroll your Hope Die.' },
        { name: 'Retracting Claws', description: 'Make an Agility Roll to scratch a target within Melee range. On a success, they become temporarily Vulnerable.' },
      ],
    },
    orc: {
      name: 'Orc',
      description: 'Orcs are humanoids recognized by their square features and boar-like tusks that protrude from their lower jaw. They typically live for 125 years, and tusks continue to grow throughout their lives. Their ears are pointed, skin has green, blue, pink, or gray tones. Height ranges from 5 feet to 6 1/2 feet.',
      features: [
        { name: 'Sturdy', description: 'When you have 1 Hit Point remaining, attacks against you have disadvantage.' },
        { name: 'Tusks', description: 'When you succeed on an attack against a target within Melee range, you can spend a Hope to gore the target with your tusks, dealing an extra 1d6 damage.' },
      ],
    },
    ribbet: {
      name: 'Ribbet',
      description: 'Ribbets resemble anthropomorphic frogs with protruding eyes and webbed hands and feet. Size ranges from 3 feet to 4 1/2 feet. Ribbets primarily move by hopping and can swim with ease. They are born from eggs, hatch into tadpoles, and after 6-7 years grow into amphibians. Ribbets live for approximately 100 years.',
      features: [
        { name: 'Amphibious', description: 'You can breathe and move naturally underwater.' },
        { name: 'Long Tongue', description: 'You can use your long tongue to grab onto things within Close range. Mark a Stress to use your tongue as a Finesse Close weapon that deals d12 physical damage using your Proficiency.' },
      ],
    },
    simiah: {
      name: 'Simiah',
      description: 'Simiah resemble anthropomorphic monkeys and apes with long limbs and prehensile feet. Size ranges from 2 to 6 feet. All simiah can use their dexterous feet for nonverbal communication, work, and combat. Some have prehensile tails. Simiah are skilled climbers and live for about 100 years.',
      features: [
        { name: 'Natural Climber', description: 'You have advantage on Agility Rolls that involve balancing and climbing.' },
        { name: 'Nimble', description: 'Gain a permanent +1 bonus to your Evasion at character creation.' },
      ],
    },
    'mixed ancestry': {
      name: 'Mixed Ancestry',
      description: 'If you decide that your character is a descendant of multiple ancestries and want to represent that mechanically, work with your GM to choose two features from the ancestries in your character\'s lineage. You must choose the first feature from one ancestry and the second from another.',
      features: [
        { name: 'Mixed Heritage', description: 'Choose the first feature from one ancestry and the second feature from another ancestry in your lineage.' },
      ],
    },
  } as Record<string, AncestryData>,

  communities: {
    highborne: {
      name: 'Highborne',
      description: 'Being part of a highborne community means you\'re accustomed to a life of elegance, opulence, and prestige within the upper echelons of society. Members possess incredible material wealth in various forms (gold, land, controlling production). This status comes with power and influence.',
      adjectives: ['amiable', 'candid', 'conniving', 'enterprising', 'ostentatious', 'unflappable'],
      feature: {
        name: 'Privilege',
        description: 'You have advantage on rolls to consort with nobles, negotiate prices, or leverage your reputation to get what you want.',
      },
    },
    loreborne: {
      name: 'Loreborne',
      description: 'Being part of a loreborne community means you\'re from a society that favors strong academic or political prowess. Loreborne highly value knowledge in forms of historical preservation, political advancement, scientific study, skill development, or lore compilation.',
      adjectives: ['direct', 'eloquent', 'inquisitive', 'patient', 'rhapsodic', 'witty'],
      feature: {
        name: 'Well-Read',
        description: 'You have advantage on rolls that involve the history, culture, or politics of a prominent person or place.',
      },
    },
    orderborne: {
      name: 'Orderborne',
      description: 'Being part of an orderborne community means you\'re from a collective that focuses on discipline or faith, and you uphold a set of principles that reflect your experience there. Orderborne are frequently powerful among surrounding communities by aligning members around a common value or goal.',
      adjectives: ['ambitious', 'benevolent', 'pensive', 'prudent', 'sardonic', 'stoic'],
      feature: {
        name: 'Dedicated',
        description: 'Record three sayings or values your upbringing instilled in you. Once per rest, when you describe how you\'re embodying one of these principles through your current action, you can roll a d20 as your Hope Die.',
      },
    },
    ridgeborne: {
      name: 'Ridgeborne',
      description: 'Being part of a ridgeborne community means you\'ve called the rocky peaks and sharp cliffs of the mountainside home. Those who\'ve lived in the mountains consider themselves hardier than most. These groups are adept at adaptation, developing unique technologies to move people and products across difficult terrain.',
      adjectives: ['bold', 'hardy', 'indomitable', 'loyal', 'reserved', 'stubborn'],
      feature: {
        name: 'Steady',
        description: 'You have advantage on rolls to traverse dangerous cliffs and ledges, navigate harsh environments, and use your survival knowledge.',
      },
    },
    seaborne: {
      name: 'Seaborne',
      description: 'Being part of a seaborne community means you lived on or near a large body of water. Seaborne communities are built, both physically and culturally, around the specific waters they call home. Some live along the shore constructing ports, while others live on the water in boats or ships.',
      adjectives: ['candid', 'cooperative', 'exuberant', 'fierce', 'resolute', 'weathered'],
      feature: {
        name: 'Know the Tide',
        description: 'You can sense the ebb and flow of life. When you roll with Fear, place a token on your community card. You can hold a number of tokens equal to your level. Before you make an action roll, you can spend any number of these tokens to gain a +1 bonus to the roll for each token spent.',
      },
    },
    slyborne: {
      name: 'Slyborne',
      description: 'Being part of a slyborne community means you come from a group that operates outside the law, including all manner of criminals, grifters, and con artists. Members are brought together by disreputable goals and clever means of achieving them.',
      adjectives: ['calculating', 'clever', 'formidable', 'perceptive', 'shrewd', 'tenacious'],
      feature: {
        name: 'Scoundrel',
        description: 'You have advantage on rolls to negotiate with criminals, detect lies, or find a safe place to hide.',
      },
    },
    underborne: {
      name: 'Underborne',
      description: 'Being part of an underborne community means you\'re from a subterranean society. Many live right beneath the cities and villages of other collectives, while some live much deeper. These communities range from small family groups in burrows to massive metropolises in caverns.',
      adjectives: ['composed', 'elusive', 'indomitable', 'innovative', 'resourceful', 'unpretentious'],
      feature: {
        name: 'Low-Light Living',
        description: 'When you\'re in an area with low light or heavy shadow, you have advantage on rolls to hide, investigate, or perceive details within that area.',
      },
    },
    wanderborne: {
      name: 'Wanderborne',
      description: 'Being part of a wanderborne community means you\'ve lived as a nomad, forgoing a permanent home and experiencing a wide variety of cultures. Unlike many communities defined by locale, wanderborne are defined by their traveling lifestyle.',
      adjectives: ['inscrutable', 'magnanimous', 'mirthful', 'reliable', 'savvy', 'unorthodox'],
      feature: {
        name: 'Nomadic Pack',
        description: 'Add a Nomadic Pack to your inventory. Once per session, you can spend a Hope to reach into this pack and pull out a mundane item that\'s useful to your situation. Work with the GM to figure out what item you take out.',
      },
    },
    wildborne: {
      name: 'Wildborne',
      description: 'Being part of a wildborne community means you lived deep within the forest. Wildborne communities are defined by their dedication to the conservation of their homelands, and many have strong religious or cultural ties to the fauna they live among.',
      adjectives: ['hardy', 'loyal', 'nurturing', 'reclusive', 'sagacious', 'vibrant'],
      feature: {
        name: 'Lightfoot',
        description: 'Your movement is naturally silent. You have advantage on rolls to move without being heard.',
      },
    },
  } as Record<string, CommunityData>,

  domains: {
    arcana: {
      name: 'Arcana',
      description: 'Arcana is the domain of innate and instinctual magic. Those who choose this path tap into the raw, enigmatic forces of the realms to manipulate both their own energy and the elements. Arcana offers wielders a volatile power, but it is incredibly potent when correctly channeled.',
      classes: ['Druid', 'Sorcerer'],
    },
    blade: {
      name: 'Blade',
      description: 'Blade is the domain of weapon mastery. Whether by steel, bow, or perhaps a more specialized arm, those who follow this path have the skill to cut short the lives of others. Wielders of Blade dedicate themselves to achieving inexorable power over death.',
      classes: ['Guardian', 'Warrior'],
    },
    bone: {
      name: 'Bone',
      description: 'Bone is the domain of tactics and the body. Practitioners of this domain have an uncanny control over their own physical abilities and an eye for predicting the behaviors of others in combat. Adherents to Bone gain an unparalleled understanding of bodies and their movements.',
      classes: ['Ranger', 'Warrior'],
    },
    codex: {
      name: 'Codex',
      description: 'Codex is the domain of intensive magical study. Those who seek magical knowledge turn to the equations of power recorded in books, written on scrolls, etched into walls, or tattooed on bodies. Codex offers a commanding and versatile understanding of magic to devotees who pursue knowledge beyond the boundaries of common wisdom.',
      classes: ['Bard', 'Wizard'],
    },
    grace: {
      name: 'Grace',
      description: 'Grace is the domain of charisma. Through rapturous storytelling, charming spells, or a shroud of lies, those who channel this power define the realities of their adversaries, bending perception to their will. Grace offers its wielders raw magnetism and mastery over language.',
      classes: ['Bard', 'Rogue'],
    },
    midnight: {
      name: 'Midnight',
      description: 'Midnight is the domain of shadows and secrecy. Whether by clever tricks, deft magic, or the cloak of night, those who channel these forces practice the art of obscurity and can uncover sequestered treasures. Midnight offers practitioners the power to control and create enigmas.',
      classes: ['Rogue', 'Sorcerer'],
    },
    sage: {
      name: 'Sage',
      description: 'Sage is the domain of the natural world. Those who walk this path tap into the unfettered power of the earth and its creatures to unleash raw magic. Sage grants its adherents the vitality of a blooming flower and the ferocity of a ravenous predator.',
      classes: ['Druid', 'Ranger'],
    },
    splendor: {
      name: 'Splendor',
      description: 'Splendor is the domain of life. Through this magic, followers gain the ability to heal and, to an extent, control death. Splendor offers its disciples the magnificent ability to both give and end life.',
      classes: ['Seraph', 'Wizard'],
    },
    valor: {
      name: 'Valor',
      description: 'Valor is the domain of protection. Whether through attack or defense, those who choose this discipline channel formidable strength to protect their allies in battle. Valor offers great power to those who raise their shields in defense of others.',
      classes: ['Guardian', 'Seraph'],
    },
  } as Record<string, DomainData>,

  weapons: [
    { name: 'Broadsword', tier: 1, category: 'primary', trait: 'Agility', range: 'Melee', damage: 'd8 phy', burden: 'One-Handed', feature: 'Reliable: +1 to attack rolls' },
    { name: 'Longsword', tier: 1, category: 'primary', trait: 'Agility', range: 'Melee', damage: 'd8+3 phy', burden: 'Two-Handed' },
    { name: 'Battleaxe', tier: 1, category: 'primary', trait: 'Strength', range: 'Melee', damage: 'd10+3 phy', burden: 'Two-Handed' },
    { name: 'Greatsword', tier: 1, category: 'primary', trait: 'Strength', range: 'Melee', damage: 'd10+3 phy', burden: 'Two-Handed', feature: 'Massive: -1 Evasion; roll extra die, discard lowest' },
    { name: 'Mace', tier: 1, category: 'primary', trait: 'Strength', range: 'Melee', damage: 'd8+1 phy', burden: 'One-Handed' },
    { name: 'Warhammer', tier: 1, category: 'primary', trait: 'Strength', range: 'Melee', damage: 'd12+3 phy', burden: 'Two-Handed', feature: 'Heavy: -1 to Evasion' },
    { name: 'Dagger', tier: 1, category: 'primary', trait: 'Finesse', range: 'Melee', damage: 'd8+1 phy', burden: 'One-Handed' },
    { name: 'Quarterstaff', tier: 1, category: 'primary', trait: 'Instinct', range: 'Melee', damage: 'd10+3 phy', burden: 'Two-Handed' },
    { name: 'Cutlass', tier: 1, category: 'primary', trait: 'Presence', range: 'Melee', damage: 'd8+1 phy', burden: 'One-Handed' },
    { name: 'Rapier', tier: 1, category: 'primary', trait: 'Presence', range: 'Melee', damage: 'd8 phy', burden: 'One-Handed', feature: 'Quick: Mark Stress to target another creature' },
    { name: 'Shortbow', tier: 1, category: 'primary', trait: 'Agility', range: 'Far', damage: 'd6+3 phy', burden: 'Two-Handed' },
    { name: 'Crossbow', tier: 1, category: 'primary', trait: 'Finesse', range: 'Far', damage: 'd6+1 phy', burden: 'One-Handed' },
    { name: 'Longbow', tier: 1, category: 'primary', trait: 'Agility', range: 'Very Far', damage: 'd8+3 phy', burden: 'Two-Handed', feature: 'Cumbersome: -1 to Finesse' },
    { name: 'Shortstaff', tier: 1, category: 'primary', trait: 'Instinct', range: 'Close', damage: 'd8+1 mag', burden: 'One-Handed' },
    { name: 'Wand', tier: 1, category: 'primary', trait: 'Knowledge', range: 'Far', damage: 'd6+1 mag', burden: 'One-Handed' },
    { name: 'Shortsword', tier: 1, category: 'secondary', trait: 'Agility', range: 'Melee', damage: 'd8 phy', burden: 'One-Handed', feature: 'Paired: +2 primary damage in Melee' },
    { name: 'Round Shield', tier: 1, category: 'secondary', trait: 'Strength', range: 'Melee', damage: 'd4 phy', burden: 'One-Handed', feature: 'Protective: +1 to Armor Score' },
    { name: 'Tower Shield', tier: 1, category: 'secondary', trait: 'Strength', range: 'Melee', damage: 'd6 phy', burden: 'One-Handed', feature: 'Barrier: +2 Armor Score; -1 Evasion' },
  ] as WeaponData[],

  armor: [
    { name: 'Gambeson Armor', tier: 1, thresholds: { major: 5, severe: 11 }, score: 3, feature: 'Flexible: +1 to Evasion' },
    { name: 'Leather Armor', tier: 1, thresholds: { major: 6, severe: 13 }, score: 3 },
    { name: 'Chainmail Armor', tier: 1, thresholds: { major: 7, severe: 15 }, score: 4, feature: 'Heavy: -1 to Evasion' },
    { name: 'Full Plate Armor', tier: 1, thresholds: { major: 8, severe: 17 }, score: 4, feature: 'Very Heavy: -2 Evasion; -1 Agility' },
  ] as ArmorData[],

  mechanics: {
    duality_dice: `## Duality Dice

All action rolls require a pair of d12s called Duality Dice - one representing Hope and one representing Fear.

When you roll, you add your trait modifier and announce your result as "[total] with [Hope/Fear]" depending on which die showed higher.

**Key Points:**
- Both dice contribute to the total
- The higher die determines whether it's "with Hope" or "with Fear"
- Matching dice = Critical Success (automatic success + bonus + gain Hope + clear Stress)`,

    action_roll: `## Action Roll Procedure

1. **Pick an appropriate trait:** GM tells you which character trait applies
2. **Determine the Difficulty:** GM sets difficulty based on scenario
3. **Apply modifiers:** Experiences, advantage, Rally dice, etc.
4. **Roll the Duality Dice:** Roll both d12s
5. **Announce result:** Sum + modifiers, state "with Hope" or "with Fear"
6. **Resolve outcome:** Work together to describe what happens

**Outcomes:**
- SUCCESS WITH HOPE: Meet difficulty + Hope higher → succeed + gain Hope
- SUCCESS WITH FEAR: Meet difficulty + Fear higher → succeed with cost, GM gains Fear
- FAILURE WITH HOPE: Miss difficulty + Hope higher → minor consequence, gain Hope
- FAILURE WITH FEAR: Miss difficulty + Fear higher → major consequence, GM gains Fear`,

    hope: `## Hope

Hope is a player resource that represents positive energy and heroic momentum.

**Starting Hope:** Every PC starts with 2 Hope
**Maximum Hope:** 6 Hope
**Carries over:** Between sessions

**Ways to Spend Hope:**
- **Help an Ally:** Roll an advantage die for an ally's action roll
- **Utilize an Experience:** Add Experience modifier to the roll
- **Initiate a Tag Team Roll:** Spend 3 Hope
- **Activate a Hope Feature:** Spend specified amount (Class Hope features cost 3 Hope)

**Ways to Gain Hope:**
- Roll with Hope on any action roll (success or failure)
- Critical Success (matching dice)
- Certain class features and abilities`,

    fear: `## Fear

Fear is the GM's resource pool that represents mounting tension and danger.

**Starting Fear:** 0 at campaign start
**Maximum Fear:** 12 Fear
**Carries over:** Between sessions

**Ways GM Gains Fear:**
- Whenever a player rolls with Fear (success or failure)
- During rests (1d4 for short rest, 1d4 + number of PCs for long rest)

**Ways GM Spends Fear:**
- Make or enhance GM moves
- Activate Fear Features (adversary special abilities)
- Increase difficulty or add complications`,

    evasion: `## Evasion

Evasion represents a character's ability to avoid attacks and hazards.

**Calculation:** Base Evasion from class + modifiers from armor, cards, and conditions

**Starting Evasion by Class:**
- Guardian, Seraph: 9
- Bard, Druid, Sorcerer: 10
- Warrior, Wizard: 11
- Ranger, Rogue: 12

**How It Works:**
- Any attack roll made against a PC uses their Evasion as the Difficulty
- Higher Evasion = harder to hit
- Some armor trades Evasion for better damage thresholds`,

    stress: `## Stress

Stress represents mental, physical, and emotional strain on your character.

**Starting Stress Slots:** 6 (some ancestries/features add more)

**Marking Stress:**
- Various abilities and features require marking Stress
- When you can't mark Stress, mark 1 HP instead

**Clearing Stress:**
- Short rest: Clear 1d4+Tier Stress
- Long rest: Clear all Stress
- Critical Success: Clear 1 Stress
- Various abilities

**Vulnerable:** When you mark your last Stress slot, you become Vulnerable until you clear at least 1 Stress.`,

    hit_points: `## Hit Points (HP)

Hit Points represent your character's ability to withstand physical injury.

**Starting HP:** Determined by class (5-7)

**Marking HP:**
Damage is compared to your damage thresholds:
- **Minor:** Below Major threshold = mark 1 HP
- **Major:** At/above Major, below Severe = mark 2 HP
- **Severe:** At/above Severe = mark 3 HP

**Death:** When you mark your last HP, you must make a death move.`,

    damage_thresholds: `## Damage Thresholds

Damage thresholds determine how much HP you mark when taking damage.

**Calculation:** Level + Armor's Base Thresholds

**Standard Thresholds (varies by armor):**
- Major: 5-8 + Level
- Severe: 11-17 + Level

**Unarmored:**
- Major threshold = Level
- Severe threshold = 2 × Level

**How Damage Works:**
1. Take incoming damage amount
2. Compare to your Major threshold
3. If below Major → Minor (1 HP)
4. If at/above Major but below Severe → Major (2 HP)
5. If at/above Severe → Severe (3 HP)`,

    attack: `## Attack Rules

**Attack Rolls:** Action rolls intended to inflict harm
- Trait specified by weapon or spell
- Difficulty equals target's Evasion

**Damage Rolls:** On successful attack
- Roll damage dice equal to your Proficiency
- Weapon specifies damage die type (d6, d8, d10, d12)
- Add any flat modifiers

**Critical Damage:** On critical success (matching dice)
- Add maximum possible dice result to final total
- Example: 2d8+1 becomes 2d8+1+16

**Damage Types:**
- Physical (phy): Most weapons
- Magic (mag): Spells and magic weapons`,

    critical_success: `## Critical Success

A Critical Success occurs when both Duality Dice show the same number (doubles).

**Effects of Critical Success:**
1. **Automatic Success:** You succeed regardless of the total
2. **Bonus Effect:** Work with GM to describe an extra benefit
3. **Gain a Hope:** Add 1 Hope to your pool
4. **Clear a Stress:** Remove 1 Stress

**On Attack Rolls:** Also deal critical damage (add max dice value to damage total)

**Note:** Even if your total wouldn't beat the Difficulty, matching dice = success!`,

    advantage: `## Advantage & Disadvantage

**Advantage:** Roll a d6 and ADD its result to your total
**Disadvantage:** Roll a d6 and SUBTRACT its result from your total

**Multiple Sources:**
- They cancel each other out one-for-one
- Example: 2 advantage + 1 disadvantage = 1 advantage

**Common Sources of Advantage:**
- Helping an ally (costs 1 Hope)
- Attacking Hidden creatures
- Various abilities and conditions

**Common Sources of Disadvantage:**
- Attacking creatures with cover
- Being Vulnerable
- Various abilities and conditions`,

    disadvantage: `## Disadvantage

Disadvantage represents difficult circumstances working against you.

**Mechanic:** Roll a d6 and SUBTRACT its result from your total

**Cancellation:** Advantage and disadvantage cancel one-for-one

**Common Sources:**
- Attacking into cover
- Being affected by certain conditions
- Environmental hazards
- Some weapon features (Heavy, Massive)`,

    conditions: `## Conditions

**Standard Conditions:**

**HIDDEN:**
- Out of sight from all enemies, location unknown
- Rolls against Hidden creature have disadvantage
- Cleared when: seen, move into sight, or make an attack

**RESTRAINED:**
- Can't move
- Can take actions from current position
- Usually applied by abilities or environmental effects

**VULNERABLE:**
- All rolls targeting you have advantage
- Automatic when last Stress slot is marked

**Temporary Conditions:** Cleared by making a successful action roll using appropriate trait

**Special Conditions:** Only cleared when specific requirements are met (stated in effect text)`,

    short_rest: `## Short Rest

**Duration:** About 1 hour in-game

**What Happens:**
1. Move domain cards between loadout and vault for free
2. Choose TWO from:
   - **Tend to Wounds:** Clear 1d4+Tier HP
   - **Clear Stress:** Clear 1d4+Tier Stress
   - **Repair Armor:** Repair 1d4+Tier armor slots
   - **Prepare:** Gain 1 Hope, or 2 Hope if with party members

**GM Gains:** 1d4 Fear

**Limit:** If three short rests are taken in a row, the next rest must be a long rest

**Interrupted:** If interrupted, no benefits are gained`,

    long_rest: `## Long Rest

**Duration:** Several in-game hours (typically overnight)

**What Happens:**
1. Move domain cards between loadout and vault for free
2. Choose TWO from:
   - **Tend to All Wounds:** Clear all HP
   - **Clear All Stress:** Clear all Stress
   - **Repair All Armor:** Repair all armor slots
   - **Prepare:** Gain 1 Hope, or 2 Hope if with party members
   - **Work on a Project:** Advance a countdown

**GM Gains:** 1d4 + number of PCs Fear, and can advance a long-term countdown

**Interrupted:** If interrupted, only receive short rest benefits`,

    death: `## Death Mechanics

When you mark your last Hit Point, you must make one of these death moves:

**BLAZE OF GLORY:**
- Embrace death
- Take one final action that automatically critically succeeds
- Then your character dies

**AVOID DEATH:**
- Drop unconscious
- Work with GM to describe how the situation worsens
- Can't move, act, or be targeted
- Return to consciousness when ally clears 1+ HP or after long rest
- Roll Hope Die - if equal to or less than your level, gain a scar (permanently cross out a Hope slot)
- If you ever cross out your last Hope slot, your character's journey ends

**RISK IT ALL:**
- Roll Duality Dice
- If Hope Die is higher: stay on feet, clear HP or Stress equal to Hope Die value
- If Fear Die is higher: you die
- If matching: stay up and clear ALL HP and Stress`,

    leveling_up: `## Leveling Up

**Tiers:**
- Tier 1: Level 1
- Tier 2: Levels 2-4
- Tier 3: Levels 5-7
- Tier 4: Levels 8-10

**Tier Achievements (at levels 2, 5, 8):**
- Gain new Experience at +2
- Increase Proficiency by 1
- At levels 5 & 8: Clear any marked traits

**Level Up Steps:**
1. Take any applicable tier achievements
2. Choose any two advancements from your tier or below
3. Increase all damage thresholds by 1
4. Acquire a new domain card at your level or lower`,

    multiclassing: `## Multiclassing

**Availability:** Level 5+

**What You Gain:**
- Choose an additional class
- Gain access to ONE of its domains
- Acquire its class feature
- Take multiclass module and foundation card from one of its subclasses

**Restrictions:**
- Can only multiclass once
- Cannot take the same class twice

**Strategic Considerations:**
- Expands your domain card options
- Adds class features from second class
- Subclass provides additional foundation feature`,

    ranges: `## Ranges

**Range Bands (assuming 1 inch = 5 feet):**

| Range | Distance | Movement |
|-------|----------|----------|
| Melee | Touch | Already there |
| Very Close | 5-10 ft | Free with action |
| Close | 10-30 ft | Free with action |
| Far | 30-100 ft | Requires Agility Roll |
| Very Far | 100-300 ft | Requires Agility Roll |
| Out of Range | 300+ ft | Usually can't target |

**Optional Grid Ranges (1-inch grid):**
- Melee: 1 square
- Very Close: 3 squares
- Close: 6 squares
- Far: 12 squares
- Very Far: 13+ squares`,

    armor_slots: `## Armor Slots

Armor Slots represent your armor's ability to absorb damage.

**Base Armor Score:** Determined by armor type (0-5)
**Maximum:** 12 Armor Slots

**Using Armor Slots:**
- When you take damage, you can mark one Armor Slot
- This reduces the HP you mark by 1
- If Armor Score is 0, you can't mark Armor Slots

**Repairing Armor:**
- Short rest: Repair 1d4+Tier slots
- Long rest: Repair all slots
- Some abilities can repair armor

**Shield Bonuses:** Shields add to your Armor Score`,
  } as Record<string, string>,
};
