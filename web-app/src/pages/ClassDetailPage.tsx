import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient, ClassDetail } from '../api/client';
import { LinkedContent } from '../components/Common/LinkedContent';
import { getSubclassImage } from '../utils/imageUrls';

export function ClassDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [classData, setClassData] = useState<ClassDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setFailedImages(new Set());
    apiClient.getClass(slug)
      .then(setClassData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleImageError = (subclassSlug: string) => {
    setFailedImages(prev => new Set(prev).add(subclassSlug));
  };

  if (loading) return <div className="loading">Loading class...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!classData) return <div className="error">Class not found</div>;

  return (
    <div className="detail-page">
      <nav className="breadcrumb">
        <Link to="/classes">Classes</Link> / {classData.name}
      </nav>

      <h1>{classData.name}</h1>

      <div className="detail-stats">
        <div className="stat">
          <span className="stat-label">Starting HP</span>
          <span className="stat-value">{classData.startingHP}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Starting Evasion</span>
          <span className="stat-value">{classData.startingEvasion}</span>
        </div>
      </div>

      <section className="detail-section">
        <h2>Domains</h2>
        <div className="tag-list">
          {classData.domains.map(domain => (
            <Link key={domain} to={`/domains/${domain.toLowerCase()}`} className="tag">
              {domain}
            </Link>
          ))}
        </div>
      </section>

      {classData.description && (
        <section className="detail-section">
          <h2>Description</h2>
          <LinkedContent content={classData.description} />
        </section>
      )}

      {classData.classItems && (
        <section className="detail-section">
          <h2>Class Items</h2>
          <LinkedContent content={classData.classItems} />
        </section>
      )}

      <section className="detail-section">
        <h2>Hope Feature: {classData.hopeFeature.name}</h2>
        <LinkedContent content={classData.hopeFeature.description} />
      </section>

      {classData.classFeatures.length > 0 && (
        <section className="detail-section">
          <h2>Class Features</h2>
          {classData.classFeatures.map((feature, i) => (
            <div key={i} className="feature">
              <h3>{feature.name}</h3>
              <LinkedContent content={feature.description} />
            </div>
          ))}
        </section>
      )}

      {classData.subclasses && classData.subclasses.length > 0 && (
        <section className="detail-section">
          <h2>Subclasses</h2>
          {classData.subclasses.map((subclass, i) => {
            const foundation = subclass.features?.find(f => !f.type || f.type === 'foundation');
            const specialization = subclass.features?.find(f => f.type === 'specialization');
            const mastery = subclass.features?.find(f => f.type === 'mastery');
            const imageUrl = getSubclassImage(subclass.slug);
            const hasImage = !failedImages.has(subclass.slug);

            return (
              <div key={i} className="subclass">
                <div className="subclass-header">
                  {hasImage && (
                    <div className="subclass-image-container">
                      <img
                        src={imageUrl}
                        alt={subclass.name}
                        className="subclass-image"
                        onError={() => handleImageError(subclass.slug)}
                      />
                    </div>
                  )}
                  <div className="subclass-header-content">
                    <h3>{subclass.name}</h3>
                    {subclass.spellcastTrait && (
                      <div className="subclass-spellcast">
                        <strong>Spellcast Trait:</strong> {subclass.spellcastTrait}
                      </div>
                    )}
                  </div>
                </div>

                <div className="subclass-features">
                  {foundation && (
                    <div className="feature">
                      <h4>Foundation: {foundation.name}</h4>
                      <LinkedContent content={foundation.description} />
                    </div>
                  )}
                  {specialization && (
                    <div className="feature">
                      <h4>Specialization: {specialization.name}</h4>
                      <LinkedContent content={specialization.description} />
                    </div>
                  )}
                  {mastery && (
                    <div className="feature">
                      <h4>Mastery: {mastery.name}</h4>
                      <LinkedContent content={mastery.description} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
}
