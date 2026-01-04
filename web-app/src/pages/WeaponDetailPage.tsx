import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient, Weapon } from '../api/client';
import { LinkedContent } from '../components/Common/LinkedContent';

export function WeaponDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [weapon, setWeapon] = useState<Weapon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    apiClient.getWeapon(slug)
      .then(setWeapon)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="loading">Loading weapon...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!weapon) return <div className="error">Weapon not found</div>;

  return (
    <div className="detail-page">
      <nav className="breadcrumb">
        <Link to="/equipment/weapons">Weapons</Link> / {weapon.name}
      </nav>

      <h1>{weapon.name}</h1>

      <div className="detail-stats">
        <div className="stat">
          <span className="stat-label">Tier</span>
          <span className="stat-value">{weapon.tier}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Category</span>
          <span className="stat-value">{weapon.category}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Trait</span>
          <span className="stat-value">{weapon.trait}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Range</span>
          <span className="stat-value">{weapon.range}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Damage</span>
          <span className="stat-value">{weapon.damage} {weapon.damageType}</span>
        </div>
      </div>

      {weapon.feature && (
        <section className="detail-section">
          <h2>Feature</h2>
          <LinkedContent content={weapon.feature} />
        </section>
      )}
    </div>
  );
}
