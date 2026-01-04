import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient, CommunitySummary } from '../api/client';

export function CommunitiesPage() {
  const [communities, setCommunities] = useState<CommunitySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient.getCommunities()
      .then(setCommunities)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading communities...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="list-page">
      <h1>Communities</h1>
      <p className="page-intro">
        Your community represents where and how your character grew up,
        shaping their personality and providing a unique community feature.
      </p>

      <div className="card-grid">
        {communities.map(community => (
          <Link key={community.slug} to={`/communities/${community.slug}`} className="card">
            <h2>{community.name}</h2>
            {community.description && <p className="card-preview">{community.description}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}
