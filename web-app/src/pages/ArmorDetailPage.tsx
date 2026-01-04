import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient, Armor } from '../api/client';
import { LinkedContent } from '../components/Common/LinkedContent';

export function ArmorDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [armor, setArmor] = useState<Armor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    apiClient.getArmorItem(slug)
      .then(setArmor)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="loading">Loading armor...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!armor) return <div className="error">Armor not found</div>;

  return (
    <div className="detail-page">
      <nav className="breadcrumb">
        <Link to="/equipment/armor">Armor</Link> / {armor.name}
      </nav>

      <h1>{armor.name}</h1>

      <div className="detail-stats">
        <div className="stat">
          <span className="stat-label">Tier</span>
          <span className="stat-value">{armor.tier}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Armor Score</span>
          <span className="stat-value">{armor.score}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Major Threshold</span>
          <span className="stat-value">{armor.thresholds.major}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Severe Threshold</span>
          <span className="stat-value">{armor.thresholds.severe}</span>
        </div>
      </div>

      {armor.feature && (
        <section className="detail-section">
          <h2>Feature</h2>
          <LinkedContent content={armor.feature} />
        </section>
      )}
    </div>
  );
}
