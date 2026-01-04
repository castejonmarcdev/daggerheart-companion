import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient, CommunityDetail } from '../api/client';
import { LinkedContent } from '../components/Common/LinkedContent';
import { getCommunityImage } from '../utils/imageUrls';

export function CommunityDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [community, setCommunity] = useState<CommunityDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setImageError(false);
    apiClient.getCommunity(slug)
      .then(setCommunity)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="loading">Loading community...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!community) return <div className="error">Community not found</div>;

  const imageUrl = slug ? getCommunityImage(slug) : '';

  return (
    <div className="detail-page">
      <nav className="breadcrumb">
        <Link to="/communities">Communities</Link> / {community.name}
      </nav>

      <div className="detail-header-with-image">
        {!imageError && imageUrl && (
          <div className="detail-image-container">
            <img
              src={imageUrl}
              alt={community.name}
              className="detail-header-image"
              onError={() => setImageError(true)}
            />
          </div>
        )}
        <div className="detail-header-content">
          <h1>{community.name}</h1>
          {community.adjectives && community.adjectives.length > 0 && (
            <div className="community-adjectives">
              <strong>Personality:</strong> {community.adjectives.join(', ')}
            </div>
          )}
          {community.description && (
            <div className="detail-description">
              <LinkedContent content={community.description} />
            </div>
          )}
        </div>
      </div>

      {community.feature && (
        <section className="detail-section">
          <h2>Community Feature: {community.feature.name}</h2>
          <LinkedContent content={community.feature.description} />
        </section>
      )}
    </div>
  );
}
