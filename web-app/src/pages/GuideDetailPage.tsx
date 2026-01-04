import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { apiClient, GuideDetail } from '../api/client';
import { LinkedContent } from '../components/Common/LinkedContent';

export function GuideDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const [guide, setGuide] = useState<GuideDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    apiClient.getGuide(slug)
      .then(setGuide)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  // Handle hash navigation for sections
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash) {
      setActiveSection(hash);
      // Scroll to section after a brief delay for DOM to update
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [location.hash, guide]);

  if (loading) return <div className="loading">Loading guide...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!guide) return <div className="error">Guide not found</div>;

  return (
    <div className="guide-page">
      <div className="guide-header">
        <span className="guide-icon">{guide.icon}</span>
        <div>
          <h1>{guide.name}</h1>
          <p className="guide-description">{guide.description}</p>
        </div>
      </div>

      <nav className="guide-toc">
        <h3>Contents</h3>
        <ul>
          {guide.sections.map((section) => (
            <li key={section.slug}>
              <a
                href={`#${section.slug}`}
                className={activeSection === section.slug ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection(section.slug);
                  const element = document.getElementById(section.slug);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                  window.history.pushState(null, '', `#${section.slug}`);
                }}
              >
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="guide-content">
        {guide.sections.map((section) => (
          <section
            key={section.slug}
            id={section.slug}
            className="guide-section"
          >
            <h2>{section.title}</h2>
            <LinkedContent content={section.content} />
          </section>
        ))}
      </div>
    </div>
  );
}
