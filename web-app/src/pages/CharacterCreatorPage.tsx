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

type Step = 'class' | 'subclass' | 'ancestry' | 'community' | 'equipment' | 'summary';

interface CharacterState {
  classData: ClassDetail | null;
  subclass: Subclass | null;
  ancestry: AncestryDetail | null;
  community: CommunityDetail | null;
  weapon: Weapon | null;
  armor: Armor | null;
}

// Class descriptions and pop culture examples
const classInfo: Record<string, { tagline: string; examples: string[] }> = {
  bard: {
    tagline: 'Inspire allies and manipulate foes with the power of performance and charm.',
    examples: ['Jaskier (The Witcher)', 'Star-Lord (Guardians)', 'Captain Jack Sparrow'],
  },
  druid: {
    tagline: 'Channel primal nature magic, shapeshift, and command the wild.',
    examples: ['Radagast (LOTR)', 'Beast Boy (Teen Titans)', 'Poison Ivy'],
  },
  guardian: {
    tagline: 'An unbreakable defender who shields allies and holds the line.',
    examples: ['Captain America', 'Brienne of Tarth (GoT)', 'The Mandalorian'],
  },
  ranger: {
    tagline: 'A deadly hunter who tracks prey and strikes from the shadows.',
    examples: ['Aragorn (LOTR)', 'Hawkeye (Avengers)', 'Katniss Everdeen'],
  },
  rogue: {
    tagline: 'A cunning trickster who exploits weaknesses and bends the rules.',
    examples: ['Black Widow', 'Arya Stark (GoT)', 'Han Solo'],
  },
  seraph: {
    tagline: 'A divine warrior blessed with holy power to smite and heal.',
    examples: ['Thor (MCU)', 'Wonder Woman', 'Castiel (Supernatural)'],
  },
  sorcerer: {
    tagline: 'Raw magical power flows through you, wild and unpredictable.',
    examples: ['Scarlet Witch', 'Elsa (Frozen)', 'Jean Grey (X-Men)'],
  },
  warrior: {
    tagline: 'A master of weapons and combat, always ready for a fight.',
    examples: ['Conan the Barbarian', 'Gimli (LOTR)', 'Kratos (God of War)'],
  },
  wizard: {
    tagline: 'A scholar of the arcane who bends reality through knowledge.',
    examples: ['Gandalf (LOTR)', 'Doctor Strange', 'Hermione Granger'],
  },
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
    weapon: null,
    armor: null,
  });

  // Data for selection lists
  const [classes, setClasses] = useState<ClassSummary[]>([]);
  const [ancestries, setAncestries] = useState<AncestrySummary[]>([]);
  const [communities, setCommunities] = useState<CommunitySummary[]>([]);
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [armors, setArmors] = useState<Armor[]>([]);
  const [loading, setLoading] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  // Load initial data
  useEffect(() => {
    apiClient.getClasses().then(setClasses);
    apiClient.getAncestries().then(setAncestries);
    apiClient.getCommunities().then(setCommunities);
    apiClient.getWeapons({ tier: 1 }).then(setWeapons);
    apiClient.getArmor({ tier: 1 }).then(setArmors);
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
      setCharacter(prev => ({ ...prev, community: communityDetail }));
      setCurrentStep('equipment');
    } finally {
      setLoading(false);
    }
  };

  const handleWeaponSelect = (weapon: Weapon) => {
    setCharacter(prev => ({ ...prev, weapon }));
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
      weapon: null,
      armor: null,
    });
    setCurrentStep('class');
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
            const foundation = sub.features.find(f => !f.type || f.type === 'foundation');

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
                  {sub.spellcastTrait && (
                    <p className="card-trait">Spellcast: {sub.spellcastTrait}</p>
                  )}
                  {foundation && (
                    <div className="card-feature">
                      <strong>{foundation.name}</strong>
                      <p>{foundation.description}</p>
                    </div>
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
          <h3>Weapon</h3>
          <div className="creator-grid creator-grid-small">
            {weapons.map(weapon => (
              <button
                key={weapon.slug}
                className={`creator-card ${character.weapon?.slug === weapon.slug ? 'selected' : ''}`}
                onClick={() => handleWeaponSelect(weapon)}
              >
                <h4>{weapon.name}</h4>
                <p className="card-stats">{weapon.damage} {weapon.damageType}</p>
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
          disabled={!character.weapon || !character.armor}
        >
          Continue to Summary
        </button>
      </div>
    </div>
  );

  const renderSummaryStep = () => {
    const { classData, subclass, ancestry, community, weapon, armor } = character;

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

          {(weapon || armor) && (
            <div className="summary-section">
              <h3>Equipment</h3>
              {weapon && (
                <p><strong>Weapon:</strong> {weapon.name} ({weapon.damage} {weapon.damageType}, {weapon.range})</p>
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
          <button className="btn btn-primary btn-large">
            Download Character Sheet (Coming Soon)
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
