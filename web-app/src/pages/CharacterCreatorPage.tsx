import { useState, useEffect } from 'react';
import {
  apiClient,
  ClassSummary,
  ClassDetail,
  Subclass,
  AncestrySummary,
  AncestryDetail,
  CommunitySummary,
  CommunityDetail,
  Weapon,
  Armor,
} from '../api/client';
import { getSubclassImage, getAncestryImage, getCommunityImage } from '../utils/imageUrls';
import { downloadCharacterSheet } from '../utils/pdfExport';

// Unarmed option for characters who don't want a weapon
const UNARMED_WEAPON: Weapon = {
  _id: 'unarmed',
  slug: 'unarmed',
  name: 'Unarmed',
  tier: 1,
  category: 'primary',
  trait: 'Unarmed',
  range: 'Melee',
  damage: 'd6 phy',
  damageType: 'phy',
};

type Step = 'class' | 'subclass' | 'ancestry' | 'community' | 'equipment' | 'summary';

interface CharacterState {
  classData: ClassDetail | null;
  subclass: Subclass | null;
  ancestry: AncestryDetail | null;
  community: CommunityDetail | null;
  weapons: Weapon[];
  armor: Armor | null;
}

// Class descriptions and pop culture examples
const classInfo: Record<string, { tagline: string; examples: string[] }> = {
  bard: {
    tagline: 'Inspire allies and manipulate foes with the power of performance and charm.',
    examples: ['Jaskier (The Witcher)', 'Edward Elric (FMA)', 'Jack Sparrow (Pirates)'],
  },
  druid: {
    tagline: 'Channel primal nature magic, shapeshift, and command the wild.',
    examples: ['San (Princess Mononoke)', 'Beast Boy (Teen Titans)', 'Maui (Moana)'],
  },
  guardian: {
    tagline: 'An unbreakable defender who shields allies and holds the line.',
    examples: ['Captain America (MCU)', 'Reinhardt (Overwatch)', 'Brienne (GoT)'],
  },
  ranger: {
    tagline: 'A deadly hunter—alone or with an animal companion—tracking prey through any terrain.',
    examples: ['Legolas (LOTR)', 'Aloy (Horizon)', 'San (Princess Mononoke)'],
  },
  rogue: {
    tagline: 'A cunning trickster who commands shadows and leverages criminal contacts.',
    examples: ['Ezio (Assassin\'s Creed)', 'Catwoman (DC)', 'Spike (Cowboy Bebop)'],
  },
  seraph: {
    tagline: 'A divine warrior blessed with holy power to smite and heal.',
    examples: ['Wonder Woman (DC)', 'Paladin Cecil (FF4)', 'Mercy (Overwatch)'],
  },
  sorcerer: {
    tagline: 'Raw magical power flows through you, wild and unpredictable.',
    examples: ['Elsa (Frozen)', 'Raven (Teen Titans)', 'Todoroki (MHA)'],
  },
  warrior: {
    tagline: 'A master of weapons and combat, always ready for a fight.',
    examples: ['Guts (Berserk)', 'Kratos (God of War)', 'Mulan (Disney)'],
  },
  wizard: {
    tagline: 'A scholar of the arcane who bends reality through knowledge.',
    examples: ['Doctor Strange (MCU)', 'Howl (Howl\'s Moving Castle)', 'Hermione (Harry Potter)'],
  },
};

// Subclass descriptions - power fantasy focused, short
const subclassInfo: Record<string, { tagline: string; examples: string[] }> = {
  // Bard
  'wordsmith': { tagline: 'Your words cut deeper than any blade, shaping reality itself.', examples: ['Scheherazade', 'Tyrion (GoT)'] },
  'troubadour': { tagline: 'Your music stirs the soul, turning the tide of battle with a song.', examples: ['Jaskier (Witcher)', 'Brook (One Piece)'] },
  // Druid
  'warden-of-the-elements': { tagline: 'Command fire, water, earth, and wind as extensions of your will.', examples: ['Aang (Avatar)', 'Storm (X-Men)'] },
  'warden-of-renewal': { tagline: 'Channel nature\'s healing power, restoring life and vitality.', examples: ['Moana', 'Groot (Guardians)'] },
  // Guardian
  'stalwart': { tagline: 'An immovable fortress—while you stand, your allies cannot fall.', examples: ['Captain America', 'All Might (MHA)'] },
  'vengeance': { tagline: 'Turn every wound you suffer into devastating retribution.', examples: ['The Punisher', 'Guts (Berserk)'] },
  // Ranger
  'wayfinder': { tagline: 'No terrain can stop you. The wild is your domain and sanctuary.', examples: ['Rengar (League of Legends)', 'Predator'] },
  'beastbound': { tagline: 'Fight alongside a loyal animal companion, two hearts as one.', examples: ['Hiccup & Toothless (HTTYD)', 'Jon Snow & Ghost'] },
  // Rogue
  'syndicate': { tagline: 'Your network of contacts and underworld connections opens any door.', examples: ['Ocean\'s Eleven crew', 'Gentleman (Kingsman)'] },
  'nightwalker': { tagline: 'Become one with the shadows, striking unseen and vanishing without a trace.', examples: ['Batman', 'Corvo (Dishonored)'] },
  // Seraph
  'winged-sentinel': { tagline: 'Soar on divine wings, raining judgment from above.', examples: ['Angel (X-Men)', 'Mercy (Overwatch)'] },
  'divine-wielder': { tagline: 'Wield holy weapons of pure light, smiting evil with righteous fury.', examples: ['Wonder Woman', 'Thor (MCU)'] },
  // Sorcerer
  'elemental-origin': { tagline: 'Your very blood burns with elemental chaos seeking release.', examples: ['Firestorm (DC)', 'Todoroki (MHA)'] },
  'primal-origin': { tagline: 'Ancient beast spirits rage within you, clawing to break free.', examples: ['Naruto (Nine-Tails)', 'Venom'] },
  // Warrior
  'call-of-the-brave': { tagline: 'Rally your allies with battle cries that turn fear into courage.', examples: ['Theoden (LOTR)', 'Leonidas (300)'] },
  'call-of-the-slayer': { tagline: 'Hunt the biggest threats, taking down monsters others flee from.', examples: ['Geralt (Witcher)', 'Doom Slayer'] },
  // Wizard
  'school-of-knowledge': { tagline: 'Your vast arcane library holds the answer to every mystery.', examples: ['Hermione (HP)', 'The Doctor (Doctor Who)'] },
  'school-of-war': { tagline: 'Magic and martial prowess combine into devastating battle magic.', examples: ['Gandalf (LOTR)', 'Yennefer (Witcher)'] },
};

// Ancestry descriptions
const ancestryInfo: Record<string, { tagline: string }> = {
  'clank': { tagline: 'Mechanical beings of clockwork and steam, crafted for a purpose.' },
  'drakona': { tagline: 'Dragon-blooded warriors with scales, breath weapons, and ancient pride.' },
  'dwarf': { tagline: 'Stout and sturdy folk with a gift for craft and an iron will.' },
  'elf': { tagline: 'Graceful and long-lived, attuned to magic and the natural world.' },
  'faerie': { tagline: 'Tiny winged tricksters brimming with mischief and fey magic.' },
  'faun': { tagline: 'Goat-legged revelers who live for joy, music, and celebration.' },
  'firbolg': { tagline: 'Gentle forest giants who speak with animals and guard the wilds.' },
  'fungril': { tagline: 'Mushroom folk who spread spores and share a collective memory.' },
  'galapa': { tagline: 'Wise turtle-like beings who carry their homes on their backs.' },
  'giant': { tagline: 'Towering humanoids of immense strength and legendary endurance.' },
  'goblin': { tagline: 'Clever scavengers who turn junk into genius inventions.' },
  'halfling': { tagline: 'Small but brave, with luck that defies all odds.' },
  'human': { tagline: 'Versatile and ambitious, adapting to any challenge.' },
  'infernis': { tagline: 'Fiend-touched beings with hellfire in their veins.' },
  'katari': { tagline: 'Feline hunters with sharp senses and deadly grace.' },
  'orc': { tagline: 'Proud warriors whose strength is matched by their honor.' },
  'ribbet': { tagline: 'Amphibious frog-folk equally at home in water and on land.' },
  'simiah': { tagline: 'Ape-like climbers with powerful builds and keen intellect.' },
  'mixed-ancestry': { tagline: 'A unique blend of heritages, combining the best of both worlds.' },
};

// Community descriptions
const communityInfo: Record<string, { tagline: string }> = {
  'highborne': { tagline: 'Raised among nobility with privilege, education, and expectations.' },
  'loreborne': { tagline: 'Scholars and keepers of ancient knowledge and secrets.' },
  'orderborne': { tagline: 'Trained in discipline and duty, serving a greater cause.' },
  'ridgeborne': { tagline: 'Mountain folk hardened by harsh peaks and thin air.' },
  'seaborne': { tagline: 'Sailors and coastal dwellers who know the ocean\'s moods.' },
  'slyborne': { tagline: 'Street-smart survivors who learned to thrive in the shadows.' },
  'underborne': { tagline: 'Denizens of the deep earth, at home in endless darkness.' },
  'wanderborne': { tagline: 'Nomads and travelers who call the open road home.' },
  'wildborne': { tagline: 'Raised in untamed wilderness, one with nature\'s rhythms.' },
};

const STEPS: { key: Step; label: string }[] = [
  { key: 'class', label: 'Class' },
  { key: 'subclass', label: 'Subclass' },
  { key: 'ancestry', label: 'Ancestry' },
  { key: 'community', label: 'Community' },
  { key: 'equipment', label: 'Equipment' },
  { key: 'summary', label: 'Summary' },
];

export function CharacterCreatorPage() {
  const [currentStep, setCurrentStep] = useState<Step>('class');
  const [character, setCharacter] = useState<CharacterState>({
    classData: null,
    subclass: null,
    ancestry: null,
    community: null,
    weapons: [],
    armor: null,
  });

  // Data for selection lists
  const [classes, setClasses] = useState<ClassSummary[]>([]);
  const [ancestries, setAncestries] = useState<AncestrySummary[]>([]);
  const [communities, setCommunities] = useState<CommunitySummary[]>([]);
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [armors, setArmors] = useState<Armor[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [downloading, setDownloading] = useState(false);

  // Load initial data
  useEffect(() => {
    Promise.all([
      apiClient.getClasses().then(setClasses),
      apiClient.getAncestries().then(setAncestries),
      apiClient.getCommunities().then(setCommunities),
      apiClient.getWeapons({ tier: 1 }).then(setWeapons),
      apiClient.getArmor({ tier: 1 }).then(setArmors),
    ]).finally(() => setInitialLoading(false));
  }, []);

  const currentStepIndex = STEPS.findIndex(s => s.key === currentStep);

  const handleImageError = (slug: string) => {
    setFailedImages(prev => new Set(prev).add(slug));
  };

  const goToStep = (step: Step) => {
    setCurrentStep(step);
  };

  const handleClassSelect = async (cls: ClassSummary) => {
    setLoading(true);
    try {
      const classDetail = await apiClient.getClass(cls.slug);
      setCharacter(prev => ({ ...prev, classData: classDetail, subclass: null }));
      setCurrentStep('subclass');
    } finally {
      setLoading(false);
    }
  };

  const handleSubclassSelect = (subclass: Subclass) => {
    setCharacter(prev => ({ ...prev, subclass }));
    setCurrentStep('ancestry');
  };

  const handleAncestrySelect = async (anc: AncestrySummary) => {
    setLoading(true);
    try {
      const ancestryDetail = await apiClient.getAncestry(anc.slug);
      setCharacter(prev => ({ ...prev, ancestry: ancestryDetail }));
      setCurrentStep('community');
    } finally {
      setLoading(false);
    }
  };

  const handleCommunitySelect = async (comm: CommunitySummary) => {
    setLoading(true);
    try {
      const communityDetail = await apiClient.getCommunity(comm.slug);
      // Reset equipment when entering equipment step
      setCharacter(prev => ({ ...prev, community: communityDetail, weapons: [], armor: null }));
      setCurrentStep('equipment');
    } finally {
      setLoading(false);
    }
  };

  const handleWeaponSelect = (weapon: Weapon) => {
    setCharacter(prev => {
      const isSelected = prev.weapons.some(w => w.slug === weapon.slug);
      if (isSelected) {
        // Remove weapon if already selected
        return { ...prev, weapons: prev.weapons.filter(w => w.slug !== weapon.slug) };
      } else {
        // Add weapon to selection
        return { ...prev, weapons: [...prev.weapons, weapon] };
      }
    });
  };

  const handleArmorSelect = (armor: Armor) => {
    setCharacter(prev => ({ ...prev, armor }));
  };

  const handleEquipmentContinue = () => {
    setCurrentStep('summary');
  };

  const handleStartOver = () => {
    setCharacter({
      classData: null,
      subclass: null,
      ancestry: null,
      community: null,
      weapons: [],
      armor: null,
    });
    setCurrentStep('class');
  };

  const handleDownloadSheet = async () => {
    const { classData, subclass, ancestry, community, weapons, armor } = character;
    if (!classData || !subclass || !ancestry || !community) return;

    setDownloading(true);
    try {
      await downloadCharacterSheet({
        className: classData.name,
        subclassName: subclass.name,
        ancestryName: ancestry.name,
        communityName: community.name,
        weaponNames: weapons.map(w => w.name),
        armorName: armor?.name,
      });
    } catch (error) {
      console.error('Failed to download character sheet:', error);
      alert('Failed to download character sheet. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="creator-steps">
      {STEPS.map((step, index) => {
        const isCompleted = index < currentStepIndex;
        const isCurrent = step.key === currentStep;
        const isClickable = index <= currentStepIndex;

        return (
          <button
            key={step.key}
            className={`creator-step ${isCurrent ? 'current' : ''} ${isCompleted ? 'completed' : ''}`}
            onClick={() => isClickable && goToStep(step.key)}
            disabled={!isClickable}
          >
            <span className="step-number">{index + 1}</span>
            <span className="step-label">{step.label}</span>
          </button>
        );
      })}
    </div>
  );

  const renderClassStep = () => (
    <div className="creator-content">
      <h2>Choose Your Class</h2>
      <p className="creator-description">
        Your class defines your character's abilities and role in the party.
      </p>
      <div className="creator-grid">
        {classes.map(cls => {
          const info = classInfo[cls.slug] || { tagline: cls.description || '', examples: [] };
          return (
            <button
              key={cls.slug}
              className="creator-card creator-card-class"
              onClick={() => handleClassSelect(cls)}
            >
              <h3>{cls.name}</h3>
              <p className="card-tagline">{info.tagline}</p>
              {info.examples.length > 0 && (
                <p className="card-examples">
                  <span className="examples-label">Think:</span> {info.examples.join(', ')}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderSubclassStep = () => {
    if (!character.classData) return null;

    return (
      <div className="creator-content">
        <h2>Choose Your Subclass</h2>
        <p className="creator-description">
          As a {character.classData.name}, pick a specialization that shapes your abilities.
        </p>
        <div className="creator-grid creator-grid-large">
          {character.classData.subclasses.map(sub => {
            const imageUrl = getSubclassImage(sub.slug);
            const hasImage = !failedImages.has(sub.slug);
            const info = subclassInfo[sub.slug];

            return (
              <button
                key={sub.slug}
                className="creator-card creator-card-with-image"
                onClick={() => handleSubclassSelect(sub)}
              >
                {hasImage && (
                  <div className="card-image">
                    <img
                      src={imageUrl}
                      alt={sub.name}
                      onError={() => handleImageError(sub.slug)}
                    />
                  </div>
                )}
                <div className="card-body">
                  <h3>{sub.name}</h3>
                  {info && <p className="card-tagline">{info.tagline}</p>}
                  {info?.examples && (
                    <p className="card-examples">
                      <span className="examples-label">Think:</span> {info.examples.join(', ')}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderAncestryStep = () => (
    <div className="creator-content">
      <h2>Choose Your Ancestry</h2>
      <p className="creator-description">
        Your ancestry represents your character's heritage and grants unique abilities.
      </p>
      <div className="creator-grid">
        {ancestries.map(anc => {
          const imageUrl = getAncestryImage(anc.slug);
          const hasImage = !failedImages.has(`ancestry-${anc.slug}`);
          const info = ancestryInfo[anc.slug];

          return (
            <button
              key={anc.slug}
              className="creator-card creator-card-with-image"
              onClick={() => handleAncestrySelect(anc)}
            >
              {hasImage && (
                <div className="card-image">
                  <img
                    src={imageUrl}
                    alt={anc.name}
                    onError={() => handleImageError(`ancestry-${anc.slug}`)}
                  />
                </div>
              )}
              <div className="card-body">
                <h3>{anc.name}</h3>
                {info && <p className="card-tagline">{info.tagline}</p>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderCommunityStep = () => (
    <div className="creator-content">
      <h2>Choose Your Community</h2>
      <p className="creator-description">
        Your community represents where you grew up and the values you were raised with.
      </p>
      <div className="creator-grid">
        {communities.map(comm => {
          const imageUrl = getCommunityImage(comm.slug);
          const hasImage = !failedImages.has(`community-${comm.slug}`);
          const info = communityInfo[comm.slug];

          return (
            <button
              key={comm.slug}
              className="creator-card creator-card-with-image"
              onClick={() => handleCommunitySelect(comm)}
            >
              {hasImage && (
                <div className="card-image">
                  <img
                    src={imageUrl}
                    alt={comm.name}
                    onError={() => handleImageError(`community-${comm.slug}`)}
                  />
                </div>
              )}
              <div className="card-body">
                <h3>{comm.name}</h3>
                {info && <p className="card-tagline">{info.tagline}</p>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderEquipmentStep = () => (
    <div className="creator-content">
      <h2>Choose Starting Equipment</h2>
      <p className="creator-description">
        Select your starting weapon and armor (Tier 1 items).
      </p>

      <div className="equipment-sections">
        <div className="equipment-section">
          <h3>Weapons {character.weapons.length > 0 && `(${character.weapons.length} selected)`}</h3>
          <div className="creator-grid creator-grid-small">
            {[UNARMED_WEAPON, ...weapons].map(weapon => (
              <button
                key={weapon.slug}
                className={`creator-card ${character.weapons.some(w => w.slug === weapon.slug) ? 'selected' : ''}`}
                onClick={() => handleWeaponSelect(weapon)}
              >
                <h4>{weapon.name}</h4>
                <p className="card-stats">{weapon.damage}</p>
                <p className="card-trait">{weapon.trait} | {weapon.range}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="equipment-section">
          <h3>Armor</h3>
          <div className="creator-grid creator-grid-small">
            {armors.map(armor => (
              <button
                key={armor.slug}
                className={`creator-card ${character.armor?.slug === armor.slug ? 'selected' : ''}`}
                onClick={() => handleArmorSelect(armor)}
              >
                <h4>{armor.name}</h4>
                <p className="card-stats">Score: {armor.score}</p>
                <p className="card-trait">
                  Thresholds: {armor.thresholds.major}/{armor.thresholds.severe}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="creator-actions">
        <button
          className="btn btn-primary btn-large"
          onClick={handleEquipmentContinue}
          disabled={character.weapons.length === 0 || !character.armor}
        >
          Continue to Summary
        </button>
      </div>
    </div>
  );

  const renderSummaryStep = () => {
    const { classData, subclass, ancestry, community, weapons, armor } = character;

    if (!classData || !subclass || !ancestry || !community) {
      return <div>Please complete all steps first.</div>;
    }

    const foundation = subclass.features.find(f => !f.type || f.type === 'foundation');

    return (
      <div className="creator-content">
        <h2>Your Character</h2>
        <p className="creator-description">
          Review your character choices below.
        </p>

        <div className="character-summary">
          <div className="summary-section">
            <h3>Class: {classData.name}</h3>
            <p><strong>Subclass:</strong> {subclass.name}</p>
            <p><strong>Domains:</strong> {classData.domains.join(' & ')}</p>
            <p><strong>Starting HP:</strong> {classData.startingHP}</p>
            <p><strong>Starting Evasion:</strong> {classData.startingEvasion}</p>
            {subclass.spellcastTrait && (
              <p><strong>Spellcast Trait:</strong> {subclass.spellcastTrait}</p>
            )}
          </div>

          <div className="summary-section">
            <h3>Heritage</h3>
            <p><strong>Ancestry:</strong> {ancestry.name}</p>
            <p><strong>Community:</strong> {community.name}</p>
          </div>

          {foundation && (
            <div className="summary-section">
              <h3>Foundation Feature</h3>
              <p><strong>{foundation.name}:</strong> {foundation.description}</p>
            </div>
          )}

          <div className="summary-section">
            <h3>Hope Feature</h3>
            <p><strong>{classData.hopeFeature.name}:</strong> {classData.hopeFeature.description}</p>
          </div>

          <div className="summary-section">
            <h3>Ancestry Features</h3>
            {ancestry.features.map((f, i) => (
              <p key={i}><strong>{f.name}:</strong> {f.description}</p>
            ))}
          </div>

          <div className="summary-section">
            <h3>Community Feature</h3>
            <p><strong>{community.feature.name}:</strong> {community.feature.description}</p>
          </div>

          {(weapons.length > 0 || armor) && (
            <div className="summary-section">
              <h3>Equipment</h3>
              {weapons.length > 0 && (
                <div>
                  <strong>Weapons:</strong>
                  <ul>
                    {weapons.map((w, i) => (
                      <li key={i}>{w.name} ({w.damage}, {w.range})</li>
                    ))}
                  </ul>
                </div>
              )}
              {armor && (
                <p><strong>Armor:</strong> {armor.name} (Score: {armor.score}, Thresholds: {armor.thresholds.major}/{armor.thresholds.severe})</p>
              )}
            </div>
          )}
        </div>

        <div className="creator-actions">
          <button className="btn btn-secondary" onClick={handleStartOver}>
            Start Over
          </button>
          <button
            className="btn btn-primary btn-large"
            onClick={handleDownloadSheet}
            disabled={downloading}
          >
            {downloading ? 'Downloading...' : 'Download Character Sheet'}
          </button>
        </div>
      </div>
    );
  };

  const renderCurrentStep = () => {
    if (loading) {
      return <div className="creator-loading">Loading...</div>;
    }

    switch (currentStep) {
      case 'class':
        return renderClassStep();
      case 'subclass':
        return renderSubclassStep();
      case 'ancestry':
        return renderAncestryStep();
      case 'community':
        return renderCommunityStep();
      case 'equipment':
        return renderEquipmentStep();
      case 'summary':
        return renderSummaryStep();
      default:
        return null;
    }
  };

  if (initialLoading) {
    return (
      <div className="character-creator-page">
        <div className="creator-header">
          <h1>Character Creator</h1>
          <p>Build your Daggerheart character step by step</p>
        </div>
        <div className="creator-initial-loading">
          <div className="spinner"></div>
          <p>Loading character options...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="character-creator-page">
      <div className="creator-header">
        <h1>Character Creator</h1>
        <p>Build your Daggerheart character step by step</p>
      </div>

      {renderStepIndicator()}
      {renderCurrentStep()}
    </div>
  );
}
