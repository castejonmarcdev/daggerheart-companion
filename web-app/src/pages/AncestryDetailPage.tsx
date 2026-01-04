import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient, AncestryDetail } from '../api/client';
import { LinkedContent } from '../components/Common/LinkedContent';
import { getAncestryImage } from '../utils/imageUrls';

export function AncestryDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [ancestry, setAncestry] = useState<AncestryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setImageError(false);
    apiClient.getAncestry(slug)
      .then(setAncestry)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="loading">Loading ancestry...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!ancestry) return <div className="error">Ancestry not found</div>;

  const imageUrl = slug ? getAncestryImage(slug) : '';

  return (
    <div className="detail-page">
      <nav className="breadcrumb">
        <Link to="/ancestries">Ancestries</Link> / {ancestry.name}
      </nav>

      <div className="detail-header-with-image">
        {!imageError && imageUrl && (
          <div className="detail-image-container">
            <img
              src={imageUrl}
              alt={ancestry.name}
              className="detail-header-image"
              onError={() => setImageError(true)}
            />
          </div>
        )}
        <div className="detail-header-content">
          <h1>{ancestry.name}</h1>
          {ancestry.description && (
            <div className="detail-description">
              <LinkedContent content={ancestry.description} />
            </div>
          )}
        </div>
      </div>

      {ancestry.features.length > 0 && (
        <section className="detail-section">
          <h2>Ancestry Features</h2>
          <p className="feature-note">Choose one of the following features:</p>
          {ancestry.features.map((feature, i) => (
            <div key={i} className="feature">
              <h3>{feature.name}</h3>
              <LinkedContent content={feature.description} />
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
