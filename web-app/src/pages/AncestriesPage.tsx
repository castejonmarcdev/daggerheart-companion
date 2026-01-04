import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient, AncestrySummary } from '../api/client';

export function AncestriesPage() {
  const [ancestries, setAncestries] = useState<AncestrySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient.getAncestries()
      .then(setAncestries)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading ancestries...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="list-page">
      <h1>Ancestries</h1>
      <p className="page-intro">
        Your ancestry represents your character's heritage and physical traits,
        providing two unique ancestry features to choose from.
      </p>

      <div className="card-grid">
        {ancestries.map(ancestry => (
          <Link key={ancestry.slug} to={`/ancestries/${ancestry.slug}`} className="card">
            <h2>{ancestry.name}</h2>
            {ancestry.description && <p className="card-preview">{ancestry.description}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}
