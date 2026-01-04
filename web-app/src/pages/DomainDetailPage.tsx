import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient, DomainDetail } from '../api/client';
import { LinkedContent } from '../components/Common/LinkedContent';
import { getDomainImage } from '../utils/imageUrls';

export function DomainDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [domain, setDomain] = useState<DomainDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setImageError(false);
    apiClient.getDomain(slug)
      .then(setDomain)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="loading">Loading domain...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!domain) return <div className="error">Domain not found</div>;

  const imageUrl = slug ? getDomainImage(slug) : '';

  return (
    <div className="detail-page">
      <nav className="breadcrumb">
        <Link to="/domains">Domains</Link> / {domain.name}
      </nav>

      <div className="detail-header-with-image">
        {!imageError && imageUrl && (
          <div className="detail-image-container">
            <img
              src={imageUrl}
              alt={domain.name}
              className="detail-header-image"
              onError={() => setImageError(true)}
            />
          </div>
        )}
        <div className="detail-header-content">
          <h1>{domain.name}</h1>
          {domain.description && (
            <div className="detail-description">
              <LinkedContent content={domain.description} />
            </div>
          )}
        </div>
      </div>

      {domain.classes && domain.classes.length > 0 && (
        <section className="detail-section">
          <h2>Classes with this Domain</h2>
          <div className="tag-list">
            {domain.classes.map(cls => (
              <Link key={cls} to={`/classes/${cls.toLowerCase()}`} className="tag">
                {cls}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
