/**
 * PDF Form Field Mappings for Daggerheart Character Sheets
 *
 * The character sheet PDFs have obfuscated field names (e.g., text_1ndka).
 * This file maps those field names to their semantic purposes.
 *
 * All class PDFs share the same field names, so we use a single common mapping.
 */

export interface PDFFieldMapping {
  // Header fields
  characterName: string;
  ancestry: string;
  levelClass: string;
  subclass: string;
  community: string;

  // Stats (modifier boxes)
  agility: string;
  strength: string;
  finesse: string;
  instinct: string;
  presence: string;
  knowledge: string;

  // Defense
  evasion: string;
  armorScore: string;

  // HP/Stress
  hp: string;
  stress: string;

  // Primary weapon
  primaryWeaponName: string;
  primaryWeaponTrait: string;
  primaryWeaponRange: string;
  primaryWeaponDamage: string;
  primaryWeaponFeature: string;

  // Secondary weapon
  secondaryWeaponName: string;
  secondaryWeaponTrait: string;
  secondaryWeaponRange: string;
  secondaryWeaponDamage: string;
  secondaryWeaponFeature: string;

  // Armor
  armorName: string;
  armorBaseScore: string;
  armorThresholdMajor: string;
  armorThresholdSevere: string;

  // Domains
  domain1: string;
  domain2: string;
}

/**
 * Common field mapping shared by all class PDFs.
 * Field positions were determined by analyzing the PDF form structure.
 */
export const PDF_FIELD_MAPPING: PDFFieldMapping = {
  // Header section (y > 700)
  characterName: 'text_1ndka', // x=207, y=765 - top left wide field
  ancestry: 'text_2fcnd', // x=199, y=746
  levelClass: 'text_3rbel', // x=401, y=765
  subclass: 'text_4kesk', // x=374, y=747
  community: 'text_13ijqs', // x=561, y=747

  // Stats (small boxes around y=686-678)
  agility: 'text_5knma', // x=213
  strength: 'text_6wpxd', // x=281
  finesse: 'text_7qqym', // x=348
  instinct: 'text_8kpeh', // x=414
  presence: 'text_9grkx', // x=483
  knowledge: 'text_10ptui', // x=549

  // Defense (left side)
  evasion: 'text_11rlpy', // x=25
  armorScore: 'text_12vpra', // x=91

  // HP/Stress markers
  hp: 'text_14usfx', // x=88, y=586
  stress: 'text_15krzg', // x=172, y=585

  // Primary weapon section (y~580-534)
  primaryWeaponName: 'text_77gdhq', // x=293, y=580
  primaryWeaponTrait: 'text_78bkpn', // x=418, y=581
  primaryWeaponRange: 'text_79uqvo', // x=513, y=581
  primaryWeaponDamage: 'text_80wobz', // x=294, y=555
  primaryWeaponFeature: 'text_81busk', // x=332, y=534

  // Secondary weapon section (y~488-441)
  secondaryWeaponName: 'text_82rurc', // x=293, y=488
  secondaryWeaponTrait: 'text_83vfic', // x=418, y=489
  secondaryWeaponRange: 'text_84khfm', // x=514, y=488
  secondaryWeaponDamage: 'text_85ysue', // x=293, y=461
  secondaryWeaponFeature: 'text_86xraf', // x=330, y=441

  // Armor section (left side, y~449-316)
  armorName: 'text_87cyng', // x=15, y=449
  armorBaseScore: 'text_88bmfc', // x=17, y=396
  armorThresholdMajor: 'text_89istq', // x=18, y=375
  armorThresholdSevere: 'text_90xbui', // x=17, y=355

  // Domains
  domain1: 'text_117zhmz', // x=293, y=357
  domain2: 'text_118otii', // x=330, y=334
};
