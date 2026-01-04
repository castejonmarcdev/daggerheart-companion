import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../config/db.js';
import { Class, Ancestry, Community, Domain, Weapon, Armor, Mechanic, Guide, SearchIndex } from '../models/index.js';

// Import the rules data from the web-app
// We'll inline the data here since we can't easily import from the web-app

function generateSlug(name: string): string {
  return name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function generateSearchText(...fields: string[]): string {
  return fields.filter(Boolean).join(' ').toLowerCase();
}

// ============================================================================
// DATA DEFINITIONS (extracted from web-app/src/api/rulesData.ts)
// ============================================================================

const classesData = {
  bard: {
    name: 'Bard',
    description: 'Bards are masters of captivation and specialize in performance types including singing, playing instruments, weaving tales, or telling jokes. They thrive in social situations.',
    domains: ['Grace', 'Codex'],
    startingEvasion: 10,
    startingHP: 5,
    classItems: 'A romance novel or a letter never opened',
    hopeFeature: {
      name: 'Make a Scene',
      description: 'Spend 3 Hope to temporarily Distract a target within Close range, giving them a -2 penalty to their Difficulty.',
    },
    classFeatures: [
      { name: 'Rally', description: 'Once per session, describe how you rally the party and give yourself and each ally a Rally Die (d6 at level 1, d8 at level 5). A PC can spend their Rally Die to roll it, adding the result to their action roll, reaction roll, damage roll, or to clear Stress equal to the result.' },
    ],
    subclasses: [
      { name: 'Troubadour', spellcastTrait: 'Presence', features: [
        { name: 'Gifted Performer', description: 'Play three types of songs once each per long rest' },
        { name: 'Maestro', description: 'When you give a Rally Die to an ally, they can gain a Hope or clear a Stress', type: 'specialization' },
        { name: 'Virtuoso', description: 'Perform each song twice per long rest', type: 'mastery' },
      ]},
      { name: 'Wordsmith', spellcastTrait: 'Presence', features: [
        { name: 'Rousing Speech', description: 'Once per long rest, all allies within Far range clear 2 Stress' },
        { name: 'Heart of a Poet', description: 'Spend a Hope to add d4 to action rolls to impress/persuade/offend' },
        { name: 'Eloquent', description: 'Once per session, provide various aids to allies', type: 'specialization' },
        { name: 'Epic Poetry', description: 'Rally Die increases to d10', type: 'mastery' },
      ]},
    ],
  },
  druid: {
    name: 'Druid',
    description: 'Druids learn from and protect the magic of the wilderness. They can transform into beasts and shape nature itself.',
    domains: ['Sage', 'Arcana'],
    startingEvasion: 10,
    startingHP: 6,
    classItems: 'A small bag of rocks and bones or a strange pendant',
    hopeFeature: { name: 'Evolution', description: 'Spend 3 Hope to transform into Beastform without marking Stress. Choose one trait to raise by +1 until you drop out.' },
    classFeatures: [
      { name: 'Beastform', description: 'Mark a Stress to transform into a creature from the Beastform list' },
      { name: 'Wildtouch', description: 'Perform harmless nature effects at will' },
    ],
    subclasses: [
      { name: 'Warden of the Elements', spellcastTrait: 'Instinct', features: [
        { name: 'Elemental Incarnation', description: 'Channel Fire, Earth, Water, or Air with unique effects' },
        { name: 'Elemental Aura', description: 'Assume an aura matching your element', type: 'specialization' },
        { name: 'Elemental Dominion', description: 'Further embody your element', type: 'mastery' },
      ]},
      { name: 'Warden of Renewal', spellcastTrait: 'Instinct', features: [
        { name: 'Clarity of Nature', description: 'Create a space of serenity to clear Stress' },
        { name: 'Regeneration', description: 'Spend 3 Hope to clear 1d4 Hit Points on a touched creature' },
        { name: "Warden's Protection", description: 'Clear 2 HP on 1d4 allies', type: 'specialization' },
        { name: 'Defender', description: 'Reduce ally damage while in Beastform', type: 'mastery' },
      ]},
    ],
  },
  guardian: {
    name: 'Guardian',
    description: 'Guardians are known for fighting with remarkable ferocity even against overwhelming odds, defending their cohort above all else.',
    domains: ['Valor', 'Blade'],
    startingEvasion: 9,
    startingHP: 7,
    classItems: 'A totem from your mentor or a secret key',
    hopeFeature: { name: 'Frontline Tank', description: 'Spend 3 Hope to clear 2 Armor Slots.' },
    classFeatures: [
      { name: 'Unstoppable', description: "Once per long rest, become Unstoppable with an Unstoppable Die (d4 at level 1, d6 at level 5). While Unstoppable: reduce physical damage severity by one threshold, add Unstoppable Die value to damage roll, can't be Restrained or Vulnerable." },
    ],
    subclasses: [
      { name: 'Stalwart', spellcastTrait: '', features: [
        { name: 'Unwavering', description: '+1 to damage thresholds' },
        { name: 'Iron Will', description: 'Mark additional Armor Slot to reduce severity' },
        { name: 'Unrelenting', description: '+2 to damage thresholds', type: 'specialization' },
        { name: 'Undaunted', description: '+3 to damage thresholds, Loyal Protector', type: 'mastery' },
      ]},
      { name: 'Vengeance', spellcastTrait: '', features: [
        { name: 'At Ease', description: 'Additional Stress slot' },
        { name: 'Revenge', description: 'Mark 2 Stress to force attacker to mark a Hit Point' },
        { name: 'Act of Reprisal', description: '+1 Proficiency against damaging adversary', type: 'specialization' },
        { name: 'Nemesis', description: 'Prioritize an adversary for special benefits', type: 'mastery' },
      ]},
    ],
  },
  ranger: {
    name: 'Ranger',
    description: 'Rangers are highly skilled hunters who become sly tacticians, pursuing quarry with cunning and patience.',
    domains: ['Bone', 'Sage'],
    startingEvasion: 12,
    startingHP: 6,
    classItems: 'A trophy from your first kill or a seemingly broken compass',
    hopeFeature: { name: 'Hold Them Off', description: 'Spend 3 Hope when you succeed on an attack to use that roll against two additional adversaries.' },
    classFeatures: [
      { name: "Ranger's Focus", description: "Spend a Hope to make a target your Focus, gaining: know their precise direction, target must mark Stress when you deal damage, can reroll Duality Dice on failed attacks against them." },
    ],
    subclasses: [
      { name: 'Beastbound', spellcastTrait: 'Agility', features: [
        { name: 'Companion', description: 'Animal companion that stays by your side' },
        { name: 'Expert Training', description: 'Additional level-up option for companion', type: 'specialization' },
        { name: 'Advanced Training', description: 'Two additional level-up options, Loyal Friend', type: 'mastery' },
      ]},
      { name: 'Wayfinder', spellcastTrait: 'Agility', features: [
        { name: 'Ruthless Predator', description: 'Mark Stress for +1 Proficiency' },
        { name: 'Path Forward', description: 'Identify shortest path to visited locations' },
        { name: 'Elusive Predator', description: '+2 Evasion against Focus attacks', type: 'specialization' },
        { name: 'Apex Predator', description: 'Remove Fear from GM pool on successful Focus attack', type: 'mastery' },
      ]},
    ],
  },
  rogue: {
    name: 'Rogue',
    description: 'Rogues are scoundrels who move through the world anonymously, utilizing sharp wits and blades.',
    domains: ['Midnight', 'Grace'],
    startingEvasion: 12,
    startingHP: 6,
    classItems: 'A set of forgery tools or a grappling hook',
    hopeFeature: { name: "Rogue's Dodge", description: 'Spend 3 Hope to gain +2 Evasion until attacked successfully or next rest.' },
    classFeatures: [
      { name: 'Cloaked', description: 'Enhanced Hidden condition' },
      { name: 'Sneak Attack', description: 'Add d6s equal to tier to damage while Cloaked or ally is near target' },
    ],
    subclasses: [
      { name: 'Nightwalker', spellcastTrait: 'Finesse', features: [
        { name: 'Shadow Stepper', description: 'Move from shadow to shadow, becoming Cloaked' },
        { name: 'Dark Cloud', description: 'Create temporary dark cloud', type: 'specialization' },
        { name: 'Fleeting Shadow', description: '+1 Evasion, extended Shadow Stepper range', type: 'mastery' },
      ]},
      { name: 'Syndicate', spellcastTrait: 'Finesse', features: [
        { name: 'Well-Connected', description: 'Know someone in every prominent location' },
        { name: 'Contacts Everywhere', description: 'Call on shady contacts once per session', type: 'specialization' },
        { name: 'Reliable Backup', description: 'Use contacts three times per session', type: 'mastery' },
      ]},
    ],
  },
  seraph: {
    name: 'Seraph',
    description: 'Seraphs are divine fighters and healers imbued with sacred purpose.',
    domains: ['Splendor', 'Valor'],
    startingEvasion: 9,
    startingHP: 7,
    classItems: 'A bundle of offerings or a sigil of your god',
    hopeFeature: { name: 'Life Support', description: 'Spend 3 Hope to clear a Hit Point on an ally within Close range.' },
    classFeatures: [
      { name: 'Prayer Dice', description: 'Roll d4s equal to Spellcast trait at session start. Spend to aid yourself or allies: reduce damage, add to rolls, or gain Hope.' },
    ],
    subclasses: [
      { name: 'Divine Wielder', spellcastTrait: 'Strength', features: [
        { name: 'Spirit Weapon', description: 'Equipped Melee/Very Close weapon can attack at Close range' },
        { name: 'Sparing Touch', description: 'Clear 2 HP or 2 Stress once per long rest' },
        { name: 'Devout', description: 'Roll extra Prayer Die, use Sparing Touch twice', type: 'specialization' },
        { name: 'Sacred Resonance', description: 'Double matching damage dice', type: 'mastery' },
      ]},
      { name: 'Winged Sentinel', spellcastTrait: 'Strength', features: [
        { name: 'Wings of Light', description: 'Fly, carry creatures, deal extra damage' },
        { name: 'Ethereal Visage', description: 'Advantage on Presence Rolls while flying', type: 'specialization' },
        { name: 'Ascendant', description: '+4 to Severe threshold', type: 'mastery' },
        { name: 'Power of the Gods', description: 'Deal 1d12 extra damage while flying', type: 'mastery' },
      ]},
    ],
  },
  sorcerer: {
    name: 'Sorcerer',
    description: 'Sorcerers cultivate and control innate magical power passed down through families.',
    domains: ['Arcana', 'Midnight'],
    startingEvasion: 10,
    startingHP: 6,
    classItems: 'A whispering orb or a family heirloom',
    hopeFeature: { name: 'Volatile Magic', description: 'Spend 3 Hope to reroll any damage dice on magic damage attacks.' },
    classFeatures: [
      { name: 'Arcane Sense', description: 'Sense magical people and objects within Close range' },
      { name: 'Minor Illusion', description: 'Create visual illusions within Close range' },
      { name: 'Channel Raw Power', description: 'Place domain card in vault to gain Hope or enhance damage' },
    ],
    subclasses: [
      { name: 'Elemental Origin', spellcastTrait: 'Instinct', features: [
        { name: 'Elementalist', description: 'Choose air, earth, fire, lightning, or water; shape element' },
        { name: 'Natural Evasion', description: 'Add d6 to Evasion against attacks', type: 'specialization' },
        { name: 'Transcendence', description: 'Transform into physical manifestation of element', type: 'mastery' },
      ]},
      { name: 'Primal Origin', spellcastTrait: 'Instinct', features: [
        { name: 'Manipulate Magic', description: 'Mark Stress after spells to extend reach, add bonuses, etc.' },
        { name: 'Enchanted Aid', description: 'Roll d8 when helping ally with Spellcast', type: 'specialization' },
        { name: 'Arcane Charge', description: 'Gather magical energy to enhance capabilities', type: 'mastery' },
      ]},
    ],
  },
  warrior: {
    name: 'Warrior',
    description: 'Warriors master weapons and violence through training and dedication, understanding the importance of an agile body and mind.',
    domains: ['Blade', 'Bone'],
    startingEvasion: 11,
    startingHP: 6,
    classItems: 'The drawing of a lover or a sharpening stone',
    hopeFeature: { name: 'No Mercy', description: 'Spend 3 Hope to gain +1 to attack rolls until next rest.' },
    classFeatures: [
      { name: 'Attack of Opportunity', description: 'Reaction roll when adversary attempts to leave Melee range' },
      { name: 'Combat Training', description: 'Ignore weapon burden, add level to physical damage rolls' },
    ],
    subclasses: [
      { name: 'Call of the Brave', spellcastTrait: '', features: [
        { name: 'Courage', description: 'Gain Hope when you fail with Fear' },
        { name: 'Battle Ritual', description: 'Clear 2 Stress and gain 2 Hope before dangerous situations' },
        { name: 'Rise to the Challenge', description: 'Roll d20 as Hope Die at 2 or fewer HP', type: 'specialization' },
        { name: 'Camaraderie', description: 'Extra Tag Team Roll, reduced cost for allies', type: 'mastery' },
      ]},
      { name: 'Call of the Slayer', spellcastTrait: '', features: [
        { name: 'Slayer', description: 'Pool of Slayer Dice to add to attack/damage rolls' },
        { name: 'Weapon Specialist', description: 'Add secondary weapon damage die', type: 'specialization' },
        { name: 'Martial Preparation', description: 'Party gains Martial Preparation downtime move', type: 'mastery' },
      ]},
    ],
  },
  wizard: {
    name: 'Wizard',
    description: 'Wizards acquire and hone magical power through years of learning using books, stones, potions, and herbs.',
    domains: ['Codex', 'Splendor'],
    startingEvasion: 11,
    startingHP: 5,
    classItems: 'A book you\'re trying to translate or a tiny, harmless elemental pet',
    hopeFeature: { name: 'Not This Time', description: 'Spend 3 Hope to force an adversary to reroll an attack or damage roll.' },
    classFeatures: [
      { name: 'Prestidigitation', description: 'Perform harmless magical effects at will' },
      { name: 'Strange Patterns', description: 'Choose a number 1-12; gain Hope or clear Stress when rolled' },
    ],
    subclasses: [
      { name: 'School of Knowledge', spellcastTrait: 'Knowledge', features: [
        { name: 'Prepared', description: 'Take additional domain card' },
        { name: 'Adept', description: 'Mark Stress instead of spending Hope to double Experience modifier' },
        { name: 'Accomplished', description: 'Another additional domain card', type: 'specialization' },
        { name: 'Brilliant', description: 'Another additional domain card, Honed Expertise', type: 'mastery' },
      ]},
      { name: 'School of War', spellcastTrait: 'Knowledge', features: [
        { name: 'Battlemage', description: 'Additional Hit Point slot' },
        { name: 'Face Your Fear', description: 'Deal extra 1d10 magic damage on success with Fear' },
        { name: 'Conjure Shield', description: 'Add Proficiency to Evasion with 2+ Hope', type: 'specialization' },
        { name: 'Have No Fear', description: 'Extra damage increases to 3d10', type: 'mastery' },
      ]},
    ],
  },
};

const ancestriesData = {
  clank: { name: 'Clank', description: 'Clanks are sentient mechanical beings built from a variety of materials, including metal, wood, and stone. They can resemble humanoids, animals, or even inanimate objects.', features: [{ name: 'Purposeful Design', description: 'Decide who made you and for what purpose. At character creation, choose one of your Experiences that best aligns with this purpose and gain a permanent +1 bonus to it.' }, { name: 'Efficient', description: 'When you take a short rest, you can choose a long rest move instead of a short rest move.' }] },
  drakona: { name: 'Drakona', description: 'Drakona resemble wingless dragons in humanoid form and possess a powerful elemental breath. All drakona have thick scales that provide excellent natural armor.', features: [{ name: 'Scales', description: 'Your scales act as natural protection. When you would take Severe damage, you can mark a Stress to mark 1 fewer Hit Points.' }, { name: 'Elemental Breath', description: 'Choose an element for your breath (such as electricity, fire, or ice). You can use this breath against a target or group of targets within Very Close range, treating it as an Instinct weapon that deals d8 magic damage using your Proficiency.' }] },
  dwarf: { name: 'Dwarf', description: 'Dwarves are short humanoids with square frames, dense musculature, and thick hair. Their skin and nails contain high keratin, making them naturally resilient.', features: [{ name: 'Thick Skin', description: 'When you take Minor damage, you can mark 2 Stress instead of marking a Hit Point.' }, { name: 'Increased Fortitude', description: 'Spend 3 Hope to halve incoming physical damage.' }] },
  elf: { name: 'Elf', description: 'Elves are typically tall humanoids with pointed ears and acutely attuned senses. All elves can drop into a celestial trance rather than sleep.', features: [{ name: 'Quick Reactions', description: 'Mark a Stress to gain advantage on a reaction roll.' }, { name: 'Celestial Trance', description: 'During a rest, you can drop into a trance to choose an additional downtime move.' }] },
  faerie: { name: 'Faerie', description: 'Faeries are winged humanoid creatures with insectile features. They possess characteristics ranging from additional arms, compound eyes, lantern organs, chitinous exoskeletons, or stingers.', features: [{ name: 'Luckbender', description: 'Once per session, after you or a willing ally within Close range makes an action roll, you can spend 3 Hope to reroll the Duality Dice.' }, { name: 'Wings', description: 'You can fly. While flying, you can mark a Stress after an adversary makes an attack against you to gain a +2 bonus to your Evasion against that attack.' }] },
  faun: { name: 'Faun', description: 'Fauns resemble humanoid goats with curving horns, square pupils, and cloven hooves. Most have a humanoid torso and a goatlike lower body covered in dense fur.', features: [{ name: 'Caprine Leap', description: 'You can leap anywhere within Close range as though you were using normal movement, allowing you to vault obstacles, jump across gaps, or scale barriers with ease.' }, { name: 'Kick', description: 'When you succeed on an attack against a target within Melee range, you can mark a Stress to kick yourself off them, dealing an extra 2d6 damage and knocking back either yourself or the target to Very Close range.' }] },
  firbolg: { name: 'Firbolg', description: 'Firbolgs are bovine humanoids typically recognized by their broad noses and long, drooping ears. They are tall and muscular with remarkable strength.', features: [{ name: 'Charge', description: 'When you succeed on an Agility Roll to move from Far or Very Far range into Melee range with one or more targets, you can mark a Stress to deal 1d12 physical damage to all targets within Melee range.' }, { name: 'Unshakable', description: "When you would mark a Stress, roll a d6. On a result of 6, don't mark it." }] },
  fungril: { name: 'Fungril', description: 'Fungril resemble humanoid mushrooms. They come in an assortment of colors and can communicate nonverbally through a mycelial array.', features: [{ name: 'Fungril Network', description: 'Make an Instinct Roll (12) to use your mycelial array to speak with others of your ancestry. On a success, you can communicate across any distance.' }, { name: 'Death Connection', description: 'While touching a corpse that died recently, you can mark a Stress to extract one memory from the corpse related to a specific emotion or sensation of your choice.' }] },
  galapa: { name: 'Galapa', description: 'Galapa resemble anthropomorphic turtles with large, domed shells into which they can retract.', features: [{ name: 'Shell', description: 'Gain a bonus to your damage thresholds equal to your Proficiency.' }, { name: 'Retract', description: "Mark a Stress to retract into your shell. While in your shell, you have resistance to physical damage, you have disadvantage on action rolls, and you can't move." }] },
  giant: { name: 'Giant', description: 'Giants are towering humanoids with broad shoulders, long arms, and one to three eyes. Those with a single eye are commonly known as cyclops.', features: [{ name: 'Endurance', description: 'Gain an additional Hit Point slot at character creation.' }, { name: 'Reach', description: 'Treat any weapon, ability, spell, or other feature that has a Melee range as though it has a Very Close range instead.' }] },
  goblin: { name: 'Goblin', description: 'Goblins are small humanoids recognizable by their large eyes and massive membranous ears. They perceive details at great distances and in darkness.', features: [{ name: 'Surefooted', description: 'You ignore disadvantage on Agility Rolls.' }, { name: 'Danger Sense', description: 'Once per rest, mark a Stress to force an adversary to reroll an attack against you or an ally within Very Close range.' }] },
  halfling: { name: 'Halfling', description: 'Halflings are small humanoids with large hairy feet and prominent rounded ears. They are naturally attuned to magnetic fields, granting them a strong internal compass.', features: [{ name: 'Luckbringer', description: 'At the start of each session, everyone in your party gains a Hope.' }, { name: 'Internal Compass', description: 'When you roll a 1 on your Hope Die, you can reroll it.' }] },
  human: { name: 'Human', description: 'Humans are recognized by their dexterous hands, rounded ears, and bodies built for endurance. Humans are physically adaptable and adjust to harsh climates with relative ease.', features: [{ name: 'High Stamina', description: 'Gain an additional Stress slot at character creation.' }, { name: 'Adaptability', description: 'When you fail a roll that utilized one of your Experiences, you can mark a Stress to reroll.' }] },
  infernis: { name: 'Infernis', description: 'Infernis are humanoids who possess sharp canine teeth, pointed ears, and horns. They are descendants of demons from the Circles Below.', features: [{ name: 'Fearless', description: 'When you roll with Fear, you can mark 2 Stress to change it into a roll with Hope instead.' }, { name: 'Dread Visage', description: 'You have advantage on rolls to intimidate hostile creatures.' }] },
  katari: { name: 'Katari', description: 'Katari are feline humanoids with retractable claws, vertically slit pupils, and high, triangular ears.', features: [{ name: 'Feline Instincts', description: 'When you make an Agility Roll, you can spend 2 Hope to reroll your Hope Die.' }, { name: 'Retracting Claws', description: 'Make an Agility Roll to scratch a target within Melee range. On a success, they become temporarily Vulnerable.' }] },
  orc: { name: 'Orc', description: 'Orcs are humanoids recognized by their square features and boar-like tusks that protrude from their lower jaw.', features: [{ name: 'Sturdy', description: 'When you have 1 Hit Point remaining, attacks against you have disadvantage.' }, { name: 'Tusks', description: 'When you succeed on an attack against a target within Melee range, you can spend a Hope to gore the target with your tusks, dealing an extra 1d6 damage.' }] },
  ribbet: { name: 'Ribbet', description: 'Ribbets resemble anthropomorphic frogs with protruding eyes and webbed hands and feet. They primarily move by hopping and can swim with ease.', features: [{ name: 'Amphibious', description: 'You can breathe and move naturally underwater.' }, { name: 'Long Tongue', description: 'You can use your long tongue to grab onto things within Close range. Mark a Stress to use your tongue as a Finesse Close weapon that deals d12 physical damage using your Proficiency.' }] },
  simiah: { name: 'Simiah', description: 'Simiah resemble anthropomorphic monkeys and apes with long limbs and prehensile feet. They are skilled climbers.', features: [{ name: 'Natural Climber', description: 'You have advantage on Agility Rolls that involve balancing and climbing.' }, { name: 'Nimble', description: 'Gain a permanent +1 bonus to your Evasion at character creation.' }] },
  'mixed-ancestry': { name: 'Mixed Ancestry', description: "If your character is a descendant of multiple ancestries, work with your GM to choose two features from the ancestries in your character's lineage.", features: [{ name: 'Mixed Heritage', description: 'Choose the first feature from one ancestry and the second feature from another ancestry in your lineage.' }] },
};

const communitiesData = {
  highborne: { name: 'Highborne', description: "Being part of a highborne community means you're accustomed to a life of elegance, opulence, and prestige within the upper echelons of society.", adjectives: ['amiable', 'candid', 'conniving', 'enterprising', 'ostentatious', 'unflappable'], feature: { name: 'Privilege', description: 'You have advantage on rolls to consort with nobles, negotiate prices, or leverage your reputation to get what you want.' } },
  loreborne: { name: 'Loreborne', description: "Being part of a loreborne community means you're from a society that favors strong academic or political prowess.", adjectives: ['direct', 'eloquent', 'inquisitive', 'patient', 'rhapsodic', 'witty'], feature: { name: 'Well-Read', description: 'You have advantage on rolls that involve the history, culture, or politics of a prominent person or place.' } },
  orderborne: { name: 'Orderborne', description: "Being part of an orderborne community means you're from a collective that focuses on discipline or faith.", adjectives: ['ambitious', 'benevolent', 'pensive', 'prudent', 'sardonic', 'stoic'], feature: { name: 'Dedicated', description: "Record three sayings or values your upbringing instilled in you. Once per rest, when you describe how you're embodying one of these principles through your current action, you can roll a d20 as your Hope Die." } },
  ridgeborne: { name: 'Ridgeborne', description: "Being part of a ridgeborne community means you've called the rocky peaks and sharp cliffs of the mountainside home.", adjectives: ['bold', 'hardy', 'indomitable', 'loyal', 'reserved', 'stubborn'], feature: { name: 'Steady', description: 'You have advantage on rolls to traverse dangerous cliffs and ledges, navigate harsh environments, and use your survival knowledge.' } },
  seaborne: { name: 'Seaborne', description: 'Being part of a seaborne community means you lived on or near a large body of water.', adjectives: ['candid', 'cooperative', 'exuberant', 'fierce', 'resolute', 'weathered'], feature: { name: 'Know the Tide', description: 'You can sense the ebb and flow of life. When you roll with Fear, place a token on your community card. Before you make an action roll, you can spend these tokens to gain a +1 bonus per token.' } },
  slyborne: { name: 'Slyborne', description: 'Being part of a slyborne community means you come from a group that operates outside the law.', adjectives: ['calculating', 'clever', 'formidable', 'perceptive', 'shrewd', 'tenacious'], feature: { name: 'Scoundrel', description: 'You have advantage on rolls to negotiate with criminals, detect lies, or find a safe place to hide.' } },
  underborne: { name: 'Underborne', description: "Being part of an underborne community means you're from a subterranean society.", adjectives: ['composed', 'elusive', 'indomitable', 'innovative', 'resourceful', 'unpretentious'], feature: { name: 'Low-Light Living', description: "When you're in an area with low light or heavy shadow, you have advantage on rolls to hide, investigate, or perceive details within that area." } },
  wanderborne: { name: 'Wanderborne', description: "Being part of a wanderborne community means you've lived as a nomad, forgoing a permanent home.", adjectives: ['inscrutable', 'magnanimous', 'mirthful', 'reliable', 'savvy', 'unorthodox'], feature: { name: 'Nomadic Pack', description: "Add a Nomadic Pack to your inventory. Once per session, you can spend a Hope to reach into this pack and pull out a mundane item that's useful to your situation." } },
  wildborne: { name: 'Wildborne', description: 'Being part of a wildborne community means you lived deep within the forest.', adjectives: ['hardy', 'loyal', 'nurturing', 'reclusive', 'sagacious', 'vibrant'], feature: { name: 'Lightfoot', description: 'Your movement is naturally silent. You have advantage on rolls to move without being heard.' } },
};

const domainsData = {
  arcana: { name: 'Arcana', description: 'Arcana is the domain of innate and instinctual magic. Those who choose this path tap into the raw, enigmatic forces of the realms to manipulate both their own energy and the elements.', classes: ['Druid', 'Sorcerer'] },
  blade: { name: 'Blade', description: 'Blade is the domain of weapon mastery. Whether by steel, bow, or perhaps a more specialized arm, those who follow this path have the skill to cut short the lives of others.', classes: ['Guardian', 'Warrior'] },
  bone: { name: 'Bone', description: 'Bone is the domain of tactics and the body. Practitioners of this domain have an uncanny control over their own physical abilities and an eye for predicting the behaviors of others in combat.', classes: ['Ranger', 'Warrior'] },
  codex: { name: 'Codex', description: 'Codex is the domain of intensive magical study. Those who seek magical knowledge turn to the equations of power recorded in books, written on scrolls, etched into walls, or tattooed on bodies.', classes: ['Bard', 'Wizard'] },
  grace: { name: 'Grace', description: 'Grace is the domain of charisma. Through rapturous storytelling, charming spells, or a shroud of lies, those who channel this power define the realities of their adversaries.', classes: ['Bard', 'Rogue'] },
  midnight: { name: 'Midnight', description: 'Midnight is the domain of shadows and secrecy. Whether by clever tricks, deft magic, or the cloak of night, those who channel these forces practice the art of obscurity.', classes: ['Rogue', 'Sorcerer'] },
  sage: { name: 'Sage', description: 'Sage is the domain of the natural world. Those who walk this path tap into the unfettered power of the earth and its creatures to unleash raw magic.', classes: ['Druid', 'Ranger'] },
  splendor: { name: 'Splendor', description: 'Splendor is the domain of life. Through this magic, followers gain the ability to heal and, to an extent, control death.', classes: ['Seraph', 'Wizard'] },
  valor: { name: 'Valor', description: 'Valor is the domain of protection. Whether through attack or defense, those who choose this discipline channel formidable strength to protect their allies in battle.', classes: ['Guardian', 'Seraph'] },
};

const weaponsData = [
  { name: 'Broadsword', tier: 1, category: 'primary', trait: 'Agility', range: 'Melee', damage: 'd8 phy', damageType: 'phy', burden: 'One-Handed', feature: 'Reliable: +1 to attack rolls' },
  { name: 'Longsword', tier: 1, category: 'primary', trait: 'Agility', range: 'Melee', damage: 'd8+3 phy', damageType: 'phy', burden: 'Two-Handed' },
  { name: 'Battleaxe', tier: 1, category: 'primary', trait: 'Strength', range: 'Melee', damage: 'd10+3 phy', damageType: 'phy', burden: 'Two-Handed' },
  { name: 'Greatsword', tier: 1, category: 'primary', trait: 'Strength', range: 'Melee', damage: 'd10+3 phy', damageType: 'phy', burden: 'Two-Handed', feature: 'Massive: -1 Evasion; roll extra die, discard lowest' },
  { name: 'Mace', tier: 1, category: 'primary', trait: 'Strength', range: 'Melee', damage: 'd8+1 phy', damageType: 'phy', burden: 'One-Handed' },
  { name: 'Warhammer', tier: 1, category: 'primary', trait: 'Strength', range: 'Melee', damage: 'd12+3 phy', damageType: 'phy', burden: 'Two-Handed', feature: 'Heavy: -1 to Evasion' },
  { name: 'Dagger', tier: 1, category: 'primary', trait: 'Finesse', range: 'Melee', damage: 'd8+1 phy', damageType: 'phy', burden: 'One-Handed' },
  { name: 'Quarterstaff', tier: 1, category: 'primary', trait: 'Instinct', range: 'Melee', damage: 'd10+3 phy', damageType: 'phy', burden: 'Two-Handed' },
  { name: 'Cutlass', tier: 1, category: 'primary', trait: 'Presence', range: 'Melee', damage: 'd8+1 phy', damageType: 'phy', burden: 'One-Handed' },
  { name: 'Rapier', tier: 1, category: 'primary', trait: 'Presence', range: 'Melee', damage: 'd8 phy', damageType: 'phy', burden: 'One-Handed', feature: 'Quick: Mark Stress to target another creature' },
  { name: 'Shortbow', tier: 1, category: 'primary', trait: 'Agility', range: 'Far', damage: 'd6+3 phy', damageType: 'phy', burden: 'Two-Handed' },
  { name: 'Crossbow', tier: 1, category: 'primary', trait: 'Finesse', range: 'Far', damage: 'd6+1 phy', damageType: 'phy', burden: 'One-Handed' },
  { name: 'Longbow', tier: 1, category: 'primary', trait: 'Agility', range: 'Very Far', damage: 'd8+3 phy', damageType: 'phy', burden: 'Two-Handed', feature: 'Cumbersome: -1 to Finesse' },
  { name: 'Shortstaff', tier: 1, category: 'primary', trait: 'Instinct', range: 'Close', damage: 'd8+1 mag', damageType: 'mag', burden: 'One-Handed' },
  { name: 'Wand', tier: 1, category: 'primary', trait: 'Knowledge', range: 'Far', damage: 'd6+1 mag', damageType: 'mag', burden: 'One-Handed' },
  { name: 'Shortsword', tier: 1, category: 'secondary', trait: 'Agility', range: 'Melee', damage: 'd8 phy', damageType: 'phy', burden: 'One-Handed', feature: 'Paired: +2 primary damage in Melee' },
  { name: 'Round Shield', tier: 1, category: 'secondary', trait: 'Strength', range: 'Melee', damage: 'd4 phy', damageType: 'phy', burden: 'One-Handed', feature: 'Protective: +1 to Armor Score' },
  { name: 'Tower Shield', tier: 1, category: 'secondary', trait: 'Strength', range: 'Melee', damage: 'd6 phy', damageType: 'phy', burden: 'One-Handed', feature: 'Barrier: +2 Armor Score; -1 Evasion' },
];

const armorData = [
  { name: 'Gambeson Armor', tier: 1, thresholds: { major: 5, severe: 11 }, score: 3, feature: 'Flexible: +1 to Evasion' },
  { name: 'Leather Armor', tier: 1, thresholds: { major: 6, severe: 13 }, score: 3 },
  { name: 'Chainmail Armor', tier: 1, thresholds: { major: 7, severe: 15 }, score: 4, feature: 'Heavy: -1 to Evasion' },
  { name: 'Full Plate Armor', tier: 1, thresholds: { major: 8, severe: 17 }, score: 4, feature: 'Very Heavy: -2 Evasion; -1 Agility' },
];

const mechanicsData = {
  'duality-dice': { name: 'Duality Dice', category: 'core', content: 'All action rolls require a pair of d12s called Duality Dice - one representing Hope and one representing Fear. When you roll, you add your trait modifier and announce your result as "[total] with [Hope/Fear]" depending on which die showed higher. Matching dice = Critical Success (automatic success + bonus + gain Hope + clear Stress).', summary: 'The core d12 Hope/Fear dice mechanic' },
  'action-roll': { name: 'Action Roll', category: 'core', content: 'Action Roll Procedure: 1. Pick an appropriate trait 2. Determine the Difficulty 3. Apply modifiers 4. Roll the Duality Dice 5. Announce result as "[total] with [Hope/Fear]" 6. Resolve outcome. Outcomes: SUCCESS WITH HOPE (meet difficulty + Hope higher = succeed + gain Hope), SUCCESS WITH FEAR (meet difficulty + Fear higher = succeed with cost, GM gains Fear), FAILURE WITH HOPE (miss + Hope higher = minor consequence, gain Hope), FAILURE WITH FEAR (miss + Fear higher = major consequence, GM gains Fear).', summary: 'How to make and resolve action rolls' },
  hope: { name: 'Hope', category: 'resources', content: 'Hope is a player resource. Every PC starts with 2 Hope (max 6). Carries over between sessions. Spend Hope to: Help an Ally (roll advantage die), Utilize an Experience (add modifier), Initiate Tag Team Roll (3 Hope), Activate Hope Features (usually 3 Hope). Gain Hope by rolling with Hope on any action roll or Critical Success.', summary: 'Player resource for special abilities' },
  fear: { name: 'Fear', category: 'resources', content: "Fear is the GM's resource pool. Starts at 0, max 12. Carries over between sessions. GM gains Fear whenever a player rolls with Fear and during rests. GM spends Fear to make or enhance GM moves and activate Fear Features.", summary: "GM resource for adversary abilities" },
  evasion: { name: 'Evasion', category: 'combat', content: "Evasion represents a character's ability to avoid attacks. Any attack roll against a PC uses their Evasion as the Difficulty. Base Evasion from class + modifiers from armor, cards, conditions. Starting Evasion by class: Guardian/Seraph 9, Bard/Druid/Sorcerer 10, Warrior/Wizard 11, Ranger/Rogue 12.", summary: 'Difficulty to hit a character' },
  stress: { name: 'Stress', category: 'resources', content: 'Stress represents mental, physical, and emotional strain. Every PC starts with 6 Stress slots. When you mark your last Stress, you become Vulnerable until you clear at least 1 Stress. When you must mark Stress but cannot, mark 1 HP instead. Clear Stress via short rest (1d4+Tier), long rest (all), or Critical Success (1).', summary: 'Mental/emotional strain resource' },
  'hit-points': { name: 'Hit Points', category: 'combat', content: 'Hit Points (HP) represent physical injury capacity. Starting HP determined by class (5-7). Damage is compared to thresholds: Minor (below Major threshold) = 1 HP, Major (at/above Major, below Severe) = 2 HP, Severe (at/above Severe) = 3 HP. When you mark your last HP, you must make a death move.', summary: 'Physical injury capacity' },
  'damage-thresholds': { name: 'Damage Thresholds', category: 'combat', content: 'Damage thresholds determine how much HP you mark. Calculation: Level + Armor Base Thresholds. Unarmored: Major = Level, Severe = 2x Level. Damage below Major = Minor (1 HP), at/above Major but below Severe = Major (2 HP), at/above Severe = Severe (3 HP).', summary: 'How damage converts to HP loss' },
  'short-rest': { name: 'Short Rest', category: 'downtime', content: 'About 1 hour in-game. Move domain cards freely. Choose TWO from: Tend to Wounds (clear 1d4+Tier HP), Clear Stress (1d4+Tier), Repair Armor (1d4+Tier slots), Prepare (gain 1-2 Hope). GM gains 1d4 Fear. Three short rests in a row = next must be long rest.', summary: 'Quick recovery option' },
  'long-rest': { name: 'Long Rest', category: 'downtime', content: 'Several hours in-game. Move domain cards freely. Choose TWO from: Clear All HP, Clear All Stress, Repair All Armor, Prepare, Work on Project. GM gains 1d4 + number of PCs Fear. Interrupted = short rest benefits only.', summary: 'Full recovery option' },
  death: { name: 'Death', category: 'combat', content: 'When you mark your last HP, choose: BLAZE OF GLORY (embrace death, take one auto-crit action, then die), AVOID DEATH (drop unconscious, situation worsens, may gain scar), RISK IT ALL (roll Duality Dice - Hope higher = stay up and heal, Fear higher = die, matching = full heal).', summary: 'What happens at 0 HP' },
  conditions: { name: 'Conditions', category: 'combat', content: 'Standard Conditions: HIDDEN (out of sight, rolls against have disadvantage), RESTRAINED (cannot move, can take actions), VULNERABLE (all rolls targeting you have advantage). Temporary conditions cleared by successful action roll. Special conditions cleared only when specific requirements met.', summary: 'Status effects on characters' },
  ranges: { name: 'Ranges', category: 'combat', content: 'Range bands: MELEE (touch), VERY CLOSE (5-10 ft, free movement), CLOSE (10-30 ft, free movement), FAR (30-100 ft, requires Agility Roll), VERY FAR (100-300 ft, requires Agility Roll), OUT OF RANGE (300+ ft, usually cannot target).', summary: 'Distance categories for combat' },
  'advantage-disadvantage': { name: 'Advantage & Disadvantage', category: 'core', content: 'Advantage: Roll a d6 and add its result to your total. Disadvantage: Roll a d6 and subtract its result from your total. Multiple instances stack (roll additional d6s). Advantage and disadvantage cancel each other out one-for-one.', summary: 'Modifiers that add or subtract a d6' },
  'critical-success': { name: 'Critical Success', category: 'core', content: 'When your Duality Dice show matching results (doubles), you score a Critical Success. You automatically succeed on the roll with a bonus effect, gain a Hope, and clear a Stress. This applies regardless of whether you met the Difficulty.', summary: 'Automatic success when Duality Dice match' },
  attack: { name: 'Attack', category: 'combat', content: 'To make an attack: 1. Choose a weapon or ability 2. Pick a target within range 3. Make an action roll using the weapon\'s trait 4. Compare to target\'s Evasion (Difficulty) 5. On success, roll damage and compare to target\'s thresholds. Damage types: Physical (phy) and Magical (mag).', summary: 'How to make attack rolls' },
  'armor-slots': { name: 'Armor Slots', category: 'combat', content: 'Armor provides Armor Slots equal to its Armor Score. When you take damage, you can mark one Armor Slot to reduce the Hit Points marked by one. Armor Slots are repaired during rests: Short Rest (1d4+Tier slots), Long Rest (all slots).', summary: 'Protection that reduces HP loss' },
  'armor-score': { name: 'Armor Score', category: 'combat', content: 'Armor Score determines how many Armor Slots your armor provides. Each piece of armor has an Armor Score (typically 3-4 for Tier 1 armor). When you equip armor, you gain that many Armor Slots which can be marked to reduce damage. Some shields also add to your Armor Score. Heavier armor tends to have higher Armor Scores but may impose Evasion penalties.', summary: 'Number of Armor Slots provided by armor' },
  'leveling-up': { name: 'Leveling Up', category: 'progression', content: 'Characters advance from Level 1 to Level 10. Each level grants: increased Proficiency, new domain cards, improved class features, and higher damage thresholds. At certain levels you gain subclass features (Foundation, Specialization, Mastery).', summary: 'Character advancement system' },
  multiclassing: { name: 'Multiclassing', category: 'progression', content: 'Available at Level 5 or higher. Choose an additional class and gain access to one of its domains. You acquire the new class\'s class feature. This allows combining abilities from multiple classes for unique character builds.', summary: 'Taking levels in a second class' },
  proficiency: { name: 'Proficiency', category: 'core', content: 'Proficiency is a bonus added to attack rolls and certain other rolls. Your Proficiency equals your character level divided by 2 (rounded up). Level 1-2: +1, Level 3-4: +2, Level 5-6: +3, Level 7-8: +4, Level 9-10: +5. Proficiency represents your growing combat expertise.', summary: 'Level-based bonus to rolls' },
  difficulty: { name: 'Difficulty', category: 'core', content: 'Difficulty is the target number you must meet or exceed on an action roll to succeed. Standard difficulties: Very Easy (6), Easy (10), Moderate (14), Hard (18), Very Hard (22), Nearly Impossible (26). When attacking a creature, their Evasion is the Difficulty.', summary: 'Target number for action rolls' },
  'domain-cards': { name: 'Domain Cards', category: 'progression', content: 'Domain cards represent abilities from your class domains. You start with cards from your two class domains. During rests, you can move domain cards between your loadout (active cards) and vault (stored cards). Higher levels grant access to more powerful domain cards.', summary: 'Abilities from class domains' },
  traits: { name: 'Traits', category: 'core', content: 'Traits are the six attributes that define your character: Agility (speed and reflexes), Strength (physical power), Finesse (precision and dexterity), Instinct (awareness and intuition), Presence (force of personality), Knowledge (learning and memory). Each trait has a modifier from -1 to +4 added to relevant rolls.', summary: 'Six character attributes' },
  tier: { name: 'Tier', category: 'progression', content: 'Tier represents your overall power level. Tier 1 (Levels 1-4): Foundation abilities. Tier 2 (Levels 5-7): Specialization abilities. Tier 3 (Levels 8-10): Mastery abilities. Tier affects damage dice, healing amounts, and other scaling effects.', summary: 'Power level bracket (1-3)' },
  'tag-team': { name: 'Tag Team Roll', category: 'core', content: 'A collaborative action where multiple PCs work together. Spend 3 Hope to initiate. Each participating PC rolls; use the highest result. On success, all participants share the benefits. On failure with Fear, all participants share consequences.', summary: 'Cooperative group roll' },
  experiences: { name: 'Experiences', category: 'progression', content: 'Experiences represent your background and training. Each Experience has a modifier (+1 to +3). When making an action roll related to an Experience, you can spend a Hope to add its modifier to your roll. Experiences include things like "Scholar of Ancient Lore" or "Street Survivor."', summary: 'Background-based skill bonuses' },
  'reaction-roll': { name: 'Reaction Roll', category: 'core', content: 'A roll made in response to an event, often defensive. Uses the same Duality Dice system as action rolls. Common reactions include dodging attacks, resisting effects, or responding to threats. Some class features grant special reaction abilities.', summary: 'Defensive response rolls' },
};

// ============================================================================
// GUIDES DATA
// ============================================================================

const guidesData = {
  'gm-guidance': {
    name: 'GM Guidance',
    description: 'The GM is responsible for guiding the narrative and roleplaying the world the PCs inhabit.',
    icon: '🎭',
    sections: [
      {
        title: 'GM Principles',
        slug: 'principles',
        content: `**BEGIN AND END WITH THE FICTION**
Use the fiction to drive mechanics, then connect the mechanics back to the fiction.

**COLLABORATE AT ALL TIMES, ESPECIALLY DURING CONFLICT**
The PCs are the protagonists of the campaign; antagonism between player and GM should exist only in the fiction.

**FILL THE WORLD WITH LIFE, WONDER, AND DANGER**
Showcase rich cultures, take the PCs to wondrous places, and introduce them to dangerous creatures.

**ASK QUESTIONS AND INCORPORATE THE ANSWERS**
Ensuring that the players' ideas are included results in a narrative that supports the whole group's creativity.

**GIVE EVERY ROLL IMPACT**
Only ask the players to roll during meaningful moments.

**PLAY TO FIND OUT WHAT HAPPENS**
Be surprised by what the characters do, the choices they make, and the people they become.

**HOLD ON GENTLY**
Don't worry if you need to abandon or alter something that came before.`,
      },
      {
        title: 'GM Practices',
        slug: 'practices',
        content: `**CULTIVATE A CURIOUS TABLE**
Follow what catches the players' interest to foster an environment of creative inquiry.

**GAIN YOUR PLAYERS' TRUST**
Act in good faith, follow through on your promises, admit your mistakes.

**KEEP THE STORY MOVING FORWARD**
Advance the story through escalating action, new information, or changing circumstances after every action roll.

**CUT TO THE ACTION**
Skip past the boring bits. When a scene drags on, end it.

**HELP THE PLAYERS USE THE GAME**
Players have more fun when you help them understand the system.

**CREATE A META CONVERSATION**
Empower players to speak out of character, use safety tools, and ask for clarification.

**TELL THEM WHAT THEY WOULD KNOW**
Don't hide obvious details or important information from the players.

**GROUND THE WORLD IN MOTIVE**
An NPC's actions flow from their goals and desires.

**BRING THE GAME'S MECHANICS TO LIFE**
Set a good example of how fiction and mechanics work together.

**REFRAME RATHER THAN REJECT**
If a player's contribution conflicts with the fiction, work with them to reshape it.

**WORK IN MOMENTS AND MONTAGES**
When framing a scene, decide which beats should be savored and which shouldn't linger.`,
      },
      {
        title: 'Pitfalls to Avoid',
        slug: 'pitfalls',
        content: `**UNDERMINING THE HEROES**
If a roll doesn't go well, show how it was impacted by an adversary's prowess, environmental factors, or unexpected surprises, rather than the PC's incompetence.

**ALWAYS TELLING THE PLAYERS WHAT TO ROLL**
Let the players decide how to handle a challenge.

**LETTING SCENES DRAG**
Shake it up or cut away when a scene has concluded, the table's energy is flagging, or people are talking in circles.

**SINGULAR SOLUTIONS**
Don't get hung up on one right answer to a problem. If the players have a clever idea, make it work.

**OVERPLANNING**
Spend your prep time inventing situations instead of scripting scenes. If the players surprise you, take a break to think through your options.

**HOARDING FEAR**
Spend Fear when you have the opportunity. The players will always generate more.`,
      },
      {
        title: 'Core GM Mechanics',
        slug: 'gm-mechanics',
        content: `**ROLLING DICE**
The GM has no Duality Dice; instead, they roll a single d20 called the GM's Die.

**ADVERSARY ATTACK ROLLS**
Roll d20 and add adversary's attack bonus. If total meets or beats target's Evasion, the attack succeeds. On success, roll damage dice.

**CRITICAL HITS**
Rolling natural 20 automatically succeeds and deals extra damage. Roll damage normally, then add the highest number on the damage dice to the total. (Example: 3d6+2 deals 18+3d6+2 on critical success.)

*Note: Critical success on an adversary's reaction roll automatically succeeds but confers no additional benefit.*`,
      },
      {
        title: 'Action Roll Guidance',
        slug: 'action-roll-guidance',
        content: `After a player describes a move, consider:

- Whether the roll is necessary (consider Experiences, backstory, pressure, possible outcomes)
- Establish the stakes before the player rolls
- Communicate any unavoidable consequences
- Optionally offer the player a choice to forgo a roll in exchange for an interesting outcome, cost, or complication`,
      },
      {
        title: 'Making GM Moves',
        slug: 'gm-moves',
        content: `GM moves change the story in response to player actions. They aren't bound by specific spells or effects - describe actions however the fiction demands.

**WHEN TO MAKE A MOVE:**
- Player rolls with Fear
- Player fails an action roll
- Player does something with unavoidable consequences
- Player gives you a "golden opportunity" (an opening demanding immediate response)
- Players look to you for what happens next`,
      },
      {
        title: 'Roll Results',
        slug: 'roll-results',
        content: `**CRITICAL SUCCESS**
Let the player describe their success, then give them an additional opportunity or advantage.

**SUCCESS WITH HOPE**
Let the player describe their success, then show how the world reacts to it.

**SUCCESS WITH FEAR**
Work with the player to describe their success, then take a Fear and make a GM move to introduce a minor consequence, complication, or cost:
- An adversary attacks
- The PC marks a Stress
- Introduce a new threat
- Raise the stakes of the conflict

**FAILURE WITH HOPE**
Describe how the PC fails to get what they want, then make a GM move to introduce a minor consequence, complication, or cost:
- An adversary attacks
- The PC marks a Stress
- Introduce a new threat
- Show how the world reacts
- Ask a question and build on the answer
- Make an NPC act in accordance with their motive
- Drive a PC to take action by dangling their goals in front of them

**FAILURE WITH FEAR**
Describe how the PC fails, then take a Fear and make a GM move to introduce a major consequence, complication, or cost.`,
      },
      {
        title: 'GM Moves List',
        slug: 'moves-list',
        content: `**SOFT MOVES** (hints, warnings, setup):
- Reveal an unwelcome truth
- Show signs of an approaching threat
- Offer an opportunity with cost
- Tell them the requirements and ask
- Put someone in a spot
- Separate them
- Announce off-screen badness

**HARD MOVES** (immediate consequences):
- Deal damage
- Use a monster's special ability
- Make a move from an environment
- Capture or corner someone
- Destroy something
- Take away something
- Create a deadline
- Inflict a condition`,
      },
      {
        title: 'Fear Features',
        slug: 'fear-features',
        content: `Many adversaries and environments have Fear Features - especially powerful or consequential moves that the GM must spend Fear to activate.

*Note: This Fear is in addition to any Fear previously spent to seize the spotlight or activate another action or ability.*`,
      },
      {
        title: 'Adversary Actions',
        slug: 'adversary-actions',
        content: `When play passes to the GM, they can make a GM move to spotlight an adversary. A spotlighted adversary can:

- Move within Close range and make a standard attack
- Move within Close range and use an adversary action
- Clear a condition
- Sprint within Far or Very Far range on the battlefield
- Do anything else the fiction demands or GM deems appropriate

The GM can spend additional Fear to spotlight additional adversaries. Once finished, the spotlight swings back to the PCs.`,
      },
      {
        title: 'Player Principles',
        slug: 'player-principles',
        content: `**PRINCIPLES:**
- Be a fan of your character and their journey
- Spotlight your friends
- Address the characters and address the players
- Build the world together
- Play to find out what happens
- Hold on gently

**BEST PRACTICES:**
- Embrace danger
- Use your resources
- Tell the story
- Discover your character`,
      },
    ],
  },
  'character-creation': {
    name: 'Character Creation',
    description: 'A step-by-step guide to creating your Daggerheart character.',
    icon: '📝',
    sections: [
      {
        title: 'Overview',
        slug: 'overview',
        content: `Unless their table chooses to use pre-generated characters, each player creates their own PC by making a series of guided choices. Some of these decisions are purely narrative, meaning they only appear in or affect the game through roleplaying, but others are mechanical choices that affect the things their PC is able to do and which actions they're more (or less) likely to succeed at when making moves and taking action.

*Note: You can fill in your character's name, pronouns, and Character Description details at any point of the character creation process.*`,
      },
      {
        title: 'Step 1: Choose a Class and Subclass',
        slug: 'step-1-class',
        content: `Classes are role-based archetypes that determine which class features and domain cards a PC gains access to throughout the campaign. There are nine classes: Bard, Druid, Guardian, Ranger, Rogue, Seraph, Sorcerer, Warrior, Wizard.

- Select a class and take its corresponding character sheet and character guide printouts. These sheets are for recording your PC's details; you'll update and reference them throughout the campaign.
- Every class begins with one or more unique class feature(s), described at the bottom left of each class's character sheet. If your class feature prompts you to make a selection, do so now.
- **Choose a Subclass:** Subclasses further refine a class archetype and reinforce its expression by granting access to unique subclass features. Each class comprises two subclasses. Select one of your class's subclasses and take its Foundation card.`,
      },
      {
        title: 'Step 2: Choose Your Heritage',
        slug: 'step-2-heritage',
        content: `Your character's heritage combines two elements: ancestry and community.

**ANCESTRY**
A character's ancestry represents their species or lineage; it grants them certain physical traits and two unique ancestry features. Choose one of the following ancestries: Clank, Drakona, Dwarf, Elf, Faerie, Faun, Firbolg, Fungril, Galapa, Giant, Goblin, Halfling, Human, Infernis, Katari, Orc, Ribbet, Simiah.

To create a **Mixed Ancestry**, take the top (first-listed) ancestry feature from one ancestry and the bottom (second-listed) ancestry feature from another.

**COMMUNITY**
Your character's community represents their culture or environment of origin and grants them a community feature. Choose one of the following communities: Highborne, Loreborne, Orderborne, Ridgeborne, Seaborne, Slyborne, Underborne, Wanderborne, Wildborne.`,
      },
      {
        title: 'Step 3: Assign Character Traits',
        slug: 'step-3-traits',
        content: `Your character has six traits that represent their physical, mental, and social aptitude:

**AGILITY** (Use it to Sprint, Leap, Maneuver, etc.)
A high Agility means you're fast on your feet, nimble on difficult terrain, and quick to react to danger.

**STRENGTH** (Use it to Lift, Smash, Grapple, etc.)
A high Strength means you're better at feats that test your physical prowess and stamina.

**FINESSE** (Use it to Control, Hide, Tinker, etc.)
A high Finesse means you're skilled at tasks that require accuracy, stealth, or the utmost control.

**INSTINCT** (Use it to Perceive, Sense, Navigate, etc.)
A high Instinct means you have a keen sense of your surroundings and a natural intuition.

**PRESENCE** (Use it to Charm, Perform, Deceive, etc.)
A high Presence means you have a strong force of personality and a facility for social situations.

**KNOWLEDGE** (Use it to Recall, Analyze, Comprehend, etc.)
A high Knowledge means you know information others don't and understand how to apply your mind through deduction and inference.

When you "roll with a trait," that trait's modifier is added to the roll's total. Assign the modifiers **+2, +1, +1, +0, +0, -1** to your character's traits in any order you wish.`,
      },
      {
        title: 'Step 4: Record Additional Info',
        slug: 'step-4-info',
        content: `- Characters start a new campaign at **Level 1**. Record your level in the designated space at the top of your character sheet.
- **Evasion** represents your character's ability to avoid damage. Your character's starting Evasion is determined by their class.
- **Hit Points (HP)** are an abstract measure of your physical health. Your starting HP is determined by your class.
- **Stress** reflects your ability to withstand mental and emotional strain. Every PC starts with **6 Stress slots**.
- **Hope** is a metacurrency that fuels special moves and certain abilities. All PCs start with **2 Hope**.`,
      },
      {
        title: 'Step 5: Choose Starting Equipment',
        slug: 'step-5-equipment',
        content: `**CHOOSE YOUR WEAPON(S):**
Select from the Tier 1 Weapon Tables. Either a two-handed primary weapon or a one-handed primary weapon and a one-handed secondary weapon.

At Level 1, your Proficiency is 1. Calculate your damage roll by combining your Proficiency value with your equipped weapon's damage dice. (Example: If your Proficiency is 1 and your weapon's damage dice is d6+1, your damage roll is 1d6+1.)

**CHOOSE YOUR ARMOR:**
Choose and equip one set of armor from the Tier 1 Armor Table. Add your character's level to your equipped armor's Base Thresholds. Record your Armor Score (equal to your equipped armor's Base Score plus any bonuses).

**STARTING INVENTORY:**
- A torch, 50 feet of rope, basic supplies, and a handful of gold
- EITHER a Minor Health Potion (clear 1d4 Hit Points) OR a Minor Stamina Potion (clear 1d4 Stress)
- One of the class-specific items listed on your character guide
- If applicable, whichever class-specific item you selected to carry your spells
- Any other GM-approved items`,
      },
      {
        title: 'Step 6: Create Your Background',
        slug: 'step-6-background',
        content: `Develop your character's background by answering the background questions in your character guide, modifying or replacing them if they don't fit the character you want to play.

*Note: Your background has no explicit mechanical effect, but it greatly affects the character you'll play and the prep the GM will do. Throughout character creation, you can adjust choices you made in earlier steps to better reflect this background. If you wish, you can leave your character's past more ambiguous and discover their backstory through play.*`,
      },
      {
        title: 'Step 7: Create Your Experiences',
        slug: 'step-7-experiences',
        content: `An Experience is a word or phrase used to encapsulate a specific set of skills, personality traits, or aptitudes your character has acquired. When your PC makes a move, they can spend a Hope to add a relevant Experience's modifier to the action roll.

- Your PC gets **two Experiences** at character creation, each with a **+2 modifier**.
- An Experience can't be too broadly applicable and it can't grant specific mechanical benefits like magic spells.

**EXAMPLE EXPERIENCES:**

*Backgrounds:* Assassin, Blacksmith, Bodyguard, Bounty Hunter, Chef to the Royal Family, Circus Performer, Con Artist, Fallen Monarch, Field Medic, High Priestess, Merchant, Noble, Pirate, Politician, Scholar, Soldier, Storyteller, Thief, World Traveler

*Characteristics:* Affable, Battle-Hardened, Bookworm, Charming, Cowardly, Friend to All, Intimidating Presence, Leader, Lone Wolf, Loyal, Observant, Prankster, Silver Tongue, Stubborn to a Fault, Survivor

*Specialties:* Acrobat, Gambler, Healer, Inventor, Magical Historian, Mapmaker, Master of Disguise, Navigator, Sharpshooter, Survivalist, Swashbuckler, Tactician

*Skills:* Animal Whisperer, Barter, Deadly Aim, Fast Learner, Incredible Strength, Liar, Light Feet, Negotiator, Photographic Memory, Quick Hands, Repair, Scavenger, Tracker

*Phrases:* Catch Me If You Can, Fake It Till You Make It, Hold the Line, I Won't Let You Down, I've Got Your Back, Knowledge Is Power, Nature's Friend, Never Again, No One Left Behind, The Show Must Go On`,
      },
      {
        title: 'Step 8: Choose Domain Cards',
        slug: 'step-8-domains',
        content: `Your class has access to two of the nine Domains. Choose **two cards** from your class's domains (listed in the upper left of your character sheet). You can take one card from each domain or two from a single domain, whichever you prefer.`,
      },
      {
        title: 'Step 9: Create Your Connections',
        slug: 'step-9-connections',
        content: `Connections are the relationships between the PCs. To create connections:

1. Go around the table and have each player describe their characters to one another - at a minimum, their name, pronouns, character description, experiences, and the answers to their background questions.

2. Discuss potential connections between the PCs using the questions included in the "Connections" section of your character guide as inspiration.

3. Suggest at least one connection between your character and each other player's PC. Accept any suggested connections you want to explore, reject any you don't.

*Note: A player can reject a suggested connection for any reason, and it's okay if there isn't an established connection between every pair of PCs - you can always discover and develop those relationships through play.*`,
      },
    ],
  },
};

// ============================================================================
// SEED FUNCTIONS
// ============================================================================

async function seedClasses() {
  console.log('Seeding classes...');
  const docs = Object.entries(classesData).map(([key, data]) => ({
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

  await Class.insertMany(docs);
  console.log(`  Inserted ${docs.length} classes`);
}

async function seedAncestries() {
  console.log('Seeding ancestries...');
  const docs = Object.entries(ancestriesData).map(([key, data]) => ({
    slug: generateSlug(data.name),
    name: data.name,
    description: data.description,
    features: data.features,
    searchText: generateSearchText(data.name, data.description, ...data.features.map(f => f.name)),
  }));

  await Ancestry.insertMany(docs);
  console.log(`  Inserted ${docs.length} ancestries`);
}

async function seedCommunities() {
  console.log('Seeding communities...');
  const docs = Object.entries(communitiesData).map(([key, data]) => ({
    slug: generateSlug(data.name),
    name: data.name,
    description: data.description,
    adjectives: data.adjectives,
    feature: data.feature,
    searchText: generateSearchText(data.name, data.description, data.feature.name),
  }));

  await Community.insertMany(docs);
  console.log(`  Inserted ${docs.length} communities`);
}

async function seedDomains() {
  console.log('Seeding domains...');
  const docs = Object.entries(domainsData).map(([key, data]) => ({
    slug: generateSlug(data.name),
    name: data.name,
    description: data.description,
    classes: data.classes,
    searchText: generateSearchText(data.name, data.description),
  }));

  await Domain.insertMany(docs);
  console.log(`  Inserted ${docs.length} domains`);
}

async function seedWeapons() {
  console.log('Seeding weapons...');
  const docs = weaponsData.map(data => ({
    slug: generateSlug(data.name),
    name: data.name,
    tier: data.tier,
    category: data.category as 'primary' | 'secondary',
    trait: data.trait,
    range: data.range,
    damage: data.damage,
    damageType: data.damageType as 'phy' | 'mag',
    burden: data.burden,
    feature: data.feature,
    searchText: generateSearchText(data.name, data.trait, data.range, data.feature || ''),
  }));

  await Weapon.insertMany(docs);
  console.log(`  Inserted ${docs.length} weapons`);
}

async function seedArmor() {
  console.log('Seeding armor...');
  const docs = armorData.map(data => ({
    slug: generateSlug(data.name),
    name: data.name,
    tier: data.tier,
    thresholds: data.thresholds,
    score: data.score,
    feature: data.feature,
    searchText: generateSearchText(data.name, data.feature || ''),
  }));

  await Armor.insertMany(docs);
  console.log(`  Inserted ${docs.length} armor`);
}

async function seedMechanics() {
  console.log('Seeding mechanics...');
  const docs = Object.entries(mechanicsData).map(([key, data]) => ({
    slug: key,
    name: data.name,
    category: data.category,
    content: data.content,
    summary: data.summary,
    searchText: generateSearchText(data.name, data.content, data.summary),
  }));

  await Mechanic.insertMany(docs);
  console.log(`  Inserted ${docs.length} mechanics`);
}

async function buildSearchIndex() {
  console.log('Building search index...');
  const entries: Array<{
    term: string;
    displayName: string;
    type: 'class' | 'ancestry' | 'community' | 'domain' | 'weapon' | 'armor' | 'mechanic';
    slug: string;
    priority: number;
    preview: string;
  }> = [];

  // Classes (highest priority)
  const classes = await Class.find();
  for (const c of classes) {
    entries.push({
      term: c.name.toLowerCase(),
      displayName: c.name,
      type: 'class',
      slug: c.slug,
      priority: 100,
      preview: c.description.substring(0, 80) + '...',
    });
  }

  // Ancestries
  const ancestries = await Ancestry.find();
  for (const a of ancestries) {
    entries.push({
      term: a.name.toLowerCase(),
      displayName: a.name,
      type: 'ancestry',
      slug: a.slug,
      priority: 90,
      preview: a.description.substring(0, 80) + '...',
    });
  }

  // Communities
  const communities = await Community.find();
  for (const c of communities) {
    entries.push({
      term: c.name.toLowerCase(),
      displayName: c.name,
      type: 'community',
      slug: c.slug,
      priority: 80,
      preview: c.description.substring(0, 80) + '...',
    });
  }

  // Domains
  const domains = await Domain.find();
  for (const d of domains) {
    entries.push({
      term: d.name.toLowerCase(),
      displayName: d.name,
      type: 'domain',
      slug: d.slug,
      priority: 85,
      preview: d.description.substring(0, 80) + '...',
    });
  }

  // Weapons
  const weapons = await Weapon.find();
  for (const w of weapons) {
    entries.push({
      term: w.name.toLowerCase(),
      displayName: w.name,
      type: 'weapon',
      slug: w.slug,
      priority: 70,
      preview: `${w.trait} ${w.range} weapon - ${w.damage}`,
    });
  }

  // Armor
  const armor = await Armor.find();
  for (const a of armor) {
    entries.push({
      term: a.name.toLowerCase(),
      displayName: a.name,
      type: 'armor',
      slug: a.slug,
      priority: 70,
      preview: `Thresholds ${a.thresholds.major}/${a.thresholds.severe}, Score ${a.score}`,
    });
  }

  // Mechanics
  const mechanics = await Mechanic.find();
  for (const m of mechanics) {
    entries.push({
      term: m.name.toLowerCase(),
      displayName: m.name,
      type: 'mechanic',
      slug: m.slug,
      priority: 95,
      preview: m.summary,
    });
  }

  // Guides
  const guides = await Guide.find();
  for (const g of guides) {
    entries.push({
      term: g.name.toLowerCase(),
      displayName: g.name,
      type: 'guide',
      slug: g.slug,
      priority: 90,
      preview: g.description.substring(0, 80) + '...',
    });
    // Also add individual sections
    for (const section of g.sections) {
      entries.push({
        term: section.title.toLowerCase(),
        displayName: `${g.name}: ${section.title}`,
        type: 'guide-section',
        slug: `${g.slug}#${section.slug}`,
        priority: 75,
        preview: section.content.substring(0, 80) + '...',
      });
    }
  }

  await SearchIndex.insertMany(entries);
  console.log(`  Built search index with ${entries.length} entries`);
}

async function seedGuides() {
  console.log('Seeding guides...');

  for (const [slug, data] of Object.entries(guidesData)) {
    const searchText = generateSearchText(
      data.name,
      data.description,
      ...data.sections.map(s => s.title + ' ' + s.content)
    );

    await Guide.create({
      slug,
      name: data.name,
      description: data.description,
      icon: data.icon,
      sections: data.sections,
      searchText,
    });
  }

  const count = await Guide.countDocuments();
  console.log(`  Created ${count} guides`);
}

async function clearDatabase() {
  console.log('Clearing existing data...');
  await Promise.all([
    Class.deleteMany({}),
    Ancestry.deleteMany({}),
    Community.deleteMany({}),
    Domain.deleteMany({}),
    Weapon.deleteMany({}),
    Armor.deleteMany({}),
    Mechanic.deleteMany({}),
    Guide.deleteMany({}),
    SearchIndex.deleteMany({}),
  ]);
}

async function main() {
  console.log('Starting database seed...\n');

  await connectDB();

  await clearDatabase();

  await seedDomains();
  await seedClasses();
  await seedAncestries();
  await seedCommunities();
  await seedWeapons();
  await seedArmor();
  await seedMechanics();
  await seedGuides();
  await buildSearchIndex();

  console.log('\nSeeding complete!');

  await disconnectDB();
}

main().catch(console.error);
