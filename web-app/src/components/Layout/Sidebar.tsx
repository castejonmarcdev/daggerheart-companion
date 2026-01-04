import { NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavSection {
  title: string;
  path: string;
  icon: string;
  children?: { title: string; path: string }[];
}

const navSections: NavSection[] = [
  {
    title: 'Character Creation',
    path: '/guides/character-creation',
    icon: '📝',
    children: [
      { title: 'Overview', path: '/guides/character-creation#overview' },
      { title: 'Step 1: Class', path: '/guides/character-creation#step-1-class' },
      { title: 'Step 2: Heritage', path: '/guides/character-creation#step-2-heritage' },
      { title: 'Step 3: Traits', path: '/guides/character-creation#step-3-traits' },
      { title: 'Step 4: Info', path: '/guides/character-creation#step-4-info' },
      { title: 'Step 5: Equipment', path: '/guides/character-creation#step-5-equipment' },
      { title: 'Step 6: Background', path: '/guides/character-creation#step-6-background' },
      { title: 'Step 7: Experiences', path: '/guides/character-creation#step-7-experiences' },
      { title: 'Step 8: Domains', path: '/guides/character-creation#step-8-domains' },
      { title: 'Step 9: Connections', path: '/guides/character-creation#step-9-connections' },
    ],
  },
  {
    title: 'GM Guidance',
    path: '/guides/gm-guidance',
    icon: '🎭',
    children: [
      { title: 'GM Principles', path: '/guides/gm-guidance#principles' },
      { title: 'GM Practices', path: '/guides/gm-guidance#practices' },
      { title: 'Pitfalls to Avoid', path: '/guides/gm-guidance#pitfalls' },
      { title: 'Core GM Mechanics', path: '/guides/gm-guidance#gm-mechanics' },
      { title: 'Action Roll Guidance', path: '/guides/gm-guidance#action-roll-guidance' },
      { title: 'Making GM Moves', path: '/guides/gm-guidance#gm-moves' },
      { title: 'Roll Results', path: '/guides/gm-guidance#roll-results' },
      { title: 'GM Moves List', path: '/guides/gm-guidance#moves-list' },
      { title: 'Fear Features', path: '/guides/gm-guidance#fear-features' },
      { title: 'Adversary Actions', path: '/guides/gm-guidance#adversary-actions' },
      { title: 'Player Principles', path: '/guides/gm-guidance#player-principles' },
    ],
  },
  {
    title: 'Classes',
    path: '/classes',
    icon: '⚔️',
    children: [
      { title: 'All Classes', path: '/classes' },
      { title: 'Bard', path: '/classes/bard' },
      { title: 'Druid', path: '/classes/druid' },
      { title: 'Guardian', path: '/classes/guardian' },
      { title: 'Ranger', path: '/classes/ranger' },
      { title: 'Rogue', path: '/classes/rogue' },
      { title: 'Seraph', path: '/classes/seraph' },
      { title: 'Sorcerer', path: '/classes/sorcerer' },
      { title: 'Warrior', path: '/classes/warrior' },
      { title: 'Wizard', path: '/classes/wizard' },
    ],
  },
  {
    title: 'Ancestries',
    path: '/ancestries',
    icon: '👤',
    children: [
      { title: 'All Ancestries', path: '/ancestries' },
      { title: 'Clank', path: '/ancestries/clank' },
      { title: 'Drakona', path: '/ancestries/drakona' },
      { title: 'Dwarf', path: '/ancestries/dwarf' },
      { title: 'Elf', path: '/ancestries/elf' },
      { title: 'Faerie', path: '/ancestries/faerie' },
      { title: 'Faun', path: '/ancestries/faun' },
      { title: 'Firbolg', path: '/ancestries/firbolg' },
      { title: 'Fungril', path: '/ancestries/fungril' },
      { title: 'Galapa', path: '/ancestries/galapa' },
      { title: 'Giant', path: '/ancestries/giant' },
      { title: 'Goblin', path: '/ancestries/goblin' },
      { title: 'Halfling', path: '/ancestries/halfling' },
      { title: 'Human', path: '/ancestries/human' },
      { title: 'Infernis', path: '/ancestries/infernis' },
      { title: 'Katari', path: '/ancestries/katari' },
      { title: 'Orc', path: '/ancestries/orc' },
      { title: 'Ribbet', path: '/ancestries/ribbet' },
      { title: 'Simiah', path: '/ancestries/simiah' },
      { title: 'Mixed Ancestry', path: '/ancestries/mixed-ancestry' },
    ],
  },
  {
    title: 'Communities',
    path: '/communities',
    icon: '🏘️',
    children: [
      { title: 'All Communities', path: '/communities' },
      { title: 'Highborne', path: '/communities/highborne' },
      { title: 'Loreborne', path: '/communities/loreborne' },
      { title: 'Orderborne', path: '/communities/orderborne' },
      { title: 'Ridgeborne', path: '/communities/ridgeborne' },
      { title: 'Seaborne', path: '/communities/seaborne' },
      { title: 'Slyborne', path: '/communities/slyborne' },
      { title: 'Underborne', path: '/communities/underborne' },
      { title: 'Wanderborne', path: '/communities/wanderborne' },
      { title: 'Wildborne', path: '/communities/wildborne' },
    ],
  },
  {
    title: 'Domains',
    path: '/domains',
    icon: '✨',
    children: [
      { title: 'All Domains', path: '/domains' },
      { title: 'Arcana', path: '/domains/arcana' },
      { title: 'Blade', path: '/domains/blade' },
      { title: 'Bone', path: '/domains/bone' },
      { title: 'Codex', path: '/domains/codex' },
      { title: 'Grace', path: '/domains/grace' },
      { title: 'Midnight', path: '/domains/midnight' },
      { title: 'Sage', path: '/domains/sage' },
      { title: 'Splendor', path: '/domains/splendor' },
      { title: 'Valor', path: '/domains/valor' },
    ],
  },
  {
    title: 'Equipment',
    path: '/equipment',
    icon: '🛡️',
    children: [
      { title: 'Weapons', path: '/equipment/weapons' },
      { title: 'Armor', path: '/equipment/armor' },
    ],
  },
  {
    title: 'Mechanics',
    path: '/mechanics',
    icon: '📜',
    children: [
      { title: 'All Mechanics', path: '/mechanics' },
      { title: 'Core', path: '/mechanics/category/core' },
      { title: 'Combat', path: '/mechanics/category/combat' },
      { title: 'Resources', path: '/mechanics/category/resources' },
      { title: 'Downtime', path: '/mechanics/category/downtime' },
      { title: 'Progression', path: '/mechanics/category/progression' },
    ],
  },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['Equipment']));
  const location = useLocation();

  // Close mobile menu when navigating
  useEffect(() => {
    if (onClose) {
      onClose();
    }
  }, [location.pathname]);

  const toggleSection = (title: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  };

  return (
    <aside className={`sidebar ${isOpen ? 'mobile-open' : ''}`}>
      <nav className="sidebar-nav">
        {navSections.map(section => (
          <div key={section.path} className="nav-section">
            {section.children ? (
              <>
                <button
                  className="nav-section-header"
                  onClick={() => toggleSection(section.title)}
                >
                  <span className="nav-icon">{section.icon}</span>
                  <span className="nav-title">{section.title}</span>
                  <span className={`nav-chevron ${expandedSections.has(section.title) ? 'expanded' : ''}`}>
                    ▸
                  </span>
                </button>
                {expandedSections.has(section.title) && (
                  <div className="nav-children">
                    {section.children.map(child => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        className={({ isActive }) => `nav-link nav-child ${isActive ? 'active' : ''}`}
                      >
                        {child.title}
                      </NavLink>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <NavLink
                to={section.path}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <span className="nav-icon">{section.icon}</span>
                <span className="nav-title">{section.title}</span>
              </NavLink>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
