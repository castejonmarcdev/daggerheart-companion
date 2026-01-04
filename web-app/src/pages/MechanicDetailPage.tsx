import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient, MechanicDetail } from '../api/client';
import { LinkedContent } from '../components/Common/LinkedContent';

export function MechanicDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [mechanic, setMechanic] = useState<MechanicDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    apiClient.getMechanic(slug)
      .then(setMechanic)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="loading">Loading mechanic...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!mechanic) return <div className="error">Mechanic not found</div>;

  return (
    <div className="detail-page">
      <nav className="breadcrumb">
        <Link to="/mechanics">Mechanics</Link>
        {' / '}
        <Link to={`/mechanics/category/${mechanic.category.toLowerCase()}`}>{mechanic.category}</Link>
        {' / '}
        {mechanic.name}
      </nav>

      <h1>{mechanic.name}</h1>

      <section className="detail-section">
        <LinkedContent content={mechanic.content} />
      </section>
    </div>
  );
}
