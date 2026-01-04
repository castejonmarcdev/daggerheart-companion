import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient, MechanicSummary } from '../api/client';

export function MechanicsPage() {
  const [mechanics, setMechanics] = useState<MechanicSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    apiClient.getMechanics(categoryFilter || undefined)
      .then(setMechanics)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [categoryFilter]);

  if (loading) return <div className="loading">Loading mechanics...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  // Get unique categories
  const categories = [...new Set(mechanics.map(m => m.category))].sort();

  // Group mechanics by category
  const grouped = mechanics.reduce((acc, m) => {
    if (!acc[m.category]) acc[m.category] = [];
    acc[m.category].push(m);
    return acc;
  }, {} as Record<string, MechanicSummary[]>);

  return (
    <div className="list-page">
      <h1>Mechanics</h1>
      <p className="page-intro">
        Core game mechanics that define how Daggerheart works,
        from dice rolls to combat and recovery.
      </p>

      <div className="filters">
        <div className="filter-group">
          <label>Category:</label>
          <select
            value={categoryFilter || ''}
            onChange={e => setCategoryFilter(e.target.value || null)}
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {Object.entries(grouped).map(([category, items]) => (
        <section key={category} className="mechanics-category">
          <Link to={`/mechanics/category/${category.toLowerCase()}`} className="category-header-link">
            <h2>{category}</h2>
          </Link>
          <div className="card-grid">
            {items.map(mechanic => (
              <Link key={mechanic.slug} to={`/mechanics/${mechanic.slug}`} className="card">
                <h3>{mechanic.name}</h3>
                {mechanic.summary && <p className="card-preview">{mechanic.summary}</p>}
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
