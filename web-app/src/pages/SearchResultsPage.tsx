import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { apiClient, SearchResult } from '../api/client';

export function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const typeFilter = searchParams.get('type') || undefined;

  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    apiClient.search(query, typeFilter)
      .then(setResults)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [query, typeFilter]);

  const getPath = (result: SearchResult) => {
    switch (result.type) {
      case 'class': return `/classes/${result.slug}`;
      case 'ancestry': return `/ancestries/${result.slug}`;
      case 'community': return `/communities/${result.slug}`;
      case 'domain': return `/domains/${result.slug}`;
      case 'weapon': return `/equipment/weapons/${result.slug}`;
      case 'armor': return `/equipment/armor/${result.slug}`;
      case 'mechanic': return `/mechanics/${result.slug}`;
      default: return '/';
    }
  };

  const getTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  if (loading) return <div className="loading">Searching...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="search-results-page">
      <h1>Search Results</h1>
      <p className="search-query">
        {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
      </p>

      {results.length === 0 ? (
        <div className="no-results">
          <p>No results found. Try searching for:</p>
          <ul>
            <li>Class names (Bard, Guardian, Wizard)</li>
            <li>Ancestry names (Elf, Dwarf, Drakona)</li>
            <li>Mechanics (Hope, Stress, Evasion)</li>
            <li>Equipment (Broadsword, Chainmail)</li>
          </ul>
        </div>
      ) : (
        <div className="search-results-list">
          {results.map((result, i) => (
            <Link key={i} to={getPath(result)} className="search-result-card">
              <div className="search-result-header">
                <span className="search-result-name">{result.name}</span>
                <span className="search-result-type">{getTypeLabel(result.type)}</span>
              </div>
              {result.preview && (
                <p className="search-result-preview">{result.preview}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
