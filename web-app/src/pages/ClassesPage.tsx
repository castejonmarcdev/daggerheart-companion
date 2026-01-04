import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient, ClassSummary } from '../api/client';

export function ClassesPage() {
  const [classes, setClasses] = useState<ClassSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient.getClasses()
      .then(setClasses)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading classes...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="list-page">
      <h1>Classes</h1>
      <p className="page-intro">
        Choose a class to define your character's combat style and abilities.
        Each class has access to two domains and unique features.
      </p>

      <div className="card-grid">
        {classes.map(cls => (
          <Link key={cls.slug} to={`/classes/${cls.slug}`} className="card">
            <h2>{cls.name}</h2>
            <div className="card-meta">
              <span>Domains: {cls.domains.join(', ')}</span>
              <span>HP: {cls.startingHP} | Evasion: {cls.startingEvasion}</span>
            </div>
            {cls.description && <p className="card-preview">{cls.description}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}
