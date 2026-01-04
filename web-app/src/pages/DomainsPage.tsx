import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient, DomainSummary } from '../api/client';

export function DomainsPage() {
  const [domains, setDomains] = useState<DomainSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient.getDomains()
      .then(setDomains)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading domains...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="list-page">
      <h1>Domains</h1>
      <p className="page-intro">
        Domains represent areas of magical or martial expertise.
        Each class has access to two domains, which provide domain cards.
      </p>

      <div className="card-grid">
        {domains.map(domain => (
          <Link key={domain.slug} to={`/domains/${domain.slug}`} className="card">
            <h2>{domain.name}</h2>
            {domain.description && <p className="card-preview">{domain.description}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}
