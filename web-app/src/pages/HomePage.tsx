import { Link } from 'react-router-dom';

export function HomePage() {
  const quickLinks = [
    { title: 'Classes', path: '/classes', icon: '⚔️', description: 'Bard, Guardian, Rogue, and more' },
    { title: 'Ancestries', path: '/ancestries', icon: '👤', description: 'Elf, Dwarf, Drakona, Faerie...' },
    { title: 'Communities', path: '/communities', icon: '🏘️', description: 'Highborne, Wildborne, Slyborne...' },
    { title: 'Domains', path: '/domains', icon: '✨', description: 'Arcana, Blade, Codex, Grace...' },
    { title: 'Weapons', path: '/equipment/weapons', icon: '🗡️', description: 'Broadswords, Longbows, Staves...' },
    { title: 'Armor', path: '/equipment/armor', icon: '🛡️', description: 'Leather, Chainmail, Plate...' },
    { title: 'Mechanics', path: '/mechanics', icon: '📜', description: 'Hope, Fear, Stress, Combat...' },
  ];

  return (
    <div className="home-page">
      <div className="home-hero">
        <h1>Daggerheart Companion</h1>
        <p className="home-tagline">Your complete reference guide to the Daggerheart TTRPG</p>
      </div>

      <section className="quick-links">
        <h2>Browse the Rules</h2>
        <div className="quick-links-grid">
          {quickLinks.map(link => (
            <Link key={link.path} to={link.path} className="quick-link-card">
              <span className="quick-link-icon">{link.icon}</span>
              <h3>{link.title}</h3>
              <p>{link.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-tips">
        <h2>Getting Started</h2>
        <ul>
          <li>Use the <strong>search bar</strong> above to quickly find any rule or concept</li>
          <li>Browse categories using the <strong>sidebar</strong> navigation</li>
          <li>Click on <strong>linked terms</strong> in descriptions to explore related concepts</li>
        </ul>
      </section>
    </div>
  );
}
