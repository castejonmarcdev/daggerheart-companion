import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient, Weapon } from '../api/client';

export function WeaponsPage() {
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tierFilter, setTierFilter] = useState<number | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const filters: { tier?: number; category?: string } = {};
    if (tierFilter) filters.tier = tierFilter;
    if (categoryFilter) filters.category = categoryFilter;

    apiClient.getWeapons(filters)
      .then(setWeapons)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [tierFilter, categoryFilter]);

  if (loading) return <div className="loading">Loading weapons...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  const tiers = [1, 2, 3, 4];
  const categories = ['Primary', 'Secondary'];

  return (
    <div className="list-page">
      <h1>Weapons</h1>
      <p className="page-intro">
        Weapons are divided into primary and secondary categories,
        and scale in power across four tiers.
      </p>

      <div className="filters">
        <div className="filter-group">
          <label>Tier:</label>
          <select
            value={tierFilter || ''}
            onChange={e => setTierFilter(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">All Tiers</option>
            {tiers.map(t => (
              <option key={t} value={t}>Tier {t}</option>
            ))}
          </select>
        </div>
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

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Tier</th>
              <th>Category</th>
              <th>Trait</th>
              <th>Range</th>
              <th>Damage</th>
            </tr>
          </thead>
          <tbody>
            {weapons.map(weapon => (
              <tr key={weapon.slug}>
                <td>
                  <Link to={`/equipment/weapons/${weapon.slug}`}>{weapon.name}</Link>
                </td>
                <td>{weapon.tier}</td>
                <td>{weapon.category}</td>
                <td>{weapon.trait}</td>
                <td>{weapon.range}</td>
                <td>{weapon.damage} {weapon.damageType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
