import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient, MechanicSummary } from '../api/client';

export function MechanicsByCategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [mechanics, setMechanics] = useState<MechanicSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!category) return;
    setLoading(true);
    apiClient.getMechanics(category)
      .then(setMechanics)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [category]);

  if (loading) return <div className="loading">Loading mechanics...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  const displayCategory = category ? category.charAt(0).toUpperCase() + category.slice(1) : '';

  return (
    <div className="list-page">
      <nav className="breadcrumb">
        <Link to="/mechanics">Mechanics</Link> / {displayCategory}
      </nav>

      <h1>{displayCategory} Mechanics</h1>
      <p className="page-intro">
        All mechanics related to {displayCategory.toLowerCase()}.
      </p>

      <div className="card-grid">
        {mechanics.map(mechanic => (
          <Link key={mechanic.slug} to={`/mechanics/${mechanic.slug}`} className="card">
            <h3>{mechanic.name}</h3>
            {mechanic.summary && <p className="card-preview">{mechanic.summary}</p>}
          </Link>
        ))}
      </div>

      {mechanics.length === 0 && (
        <p className="no-results">No mechanics found in this category.</p>
      )}
    </div>
  );
}
