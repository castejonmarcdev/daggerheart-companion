import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient, Armor } from '../api/client';

export function ArmorPage() {
  const [armor, setArmor] = useState<Armor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tierFilter, setTierFilter] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    const filters: { tier?: number } = {};
    if (tierFilter) filters.tier = tierFilter;

    apiClient.getArmor(filters)
      .then(setArmor)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [tierFilter]);

  if (loading) return <div className="loading">Loading armor...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  const tiers = [1, 2, 3, 4];

  return (
    <div className="list-page">
      <h1>Armor</h1>
      <p className="page-intro">
        Armor provides damage thresholds and an armor score.
        Higher tier armor offers better protection.
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
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Tier</th>
              <th>Armor Score</th>
              <th>Major Threshold</th>
              <th>Severe Threshold</th>
            </tr>
          </thead>
          <tbody>
            {armor.map(item => (
              <tr key={item.slug}>
                <td>
                  <Link to={`/equipment/armor/${item.slug}`}>{item.name}</Link>
                </td>
                <td>{item.tier}</td>
                <td>{item.score}</td>
                <td>{item.thresholds.major}</td>
                <td>{item.thresholds.severe}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
