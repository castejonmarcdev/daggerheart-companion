import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient, AutocompleteResult } from '../../api/client';

// Static tools that can be searched
const TOOLS: AutocompleteResult[] = [
  {
    displayName: 'Character Creator',
    type: 'tool',
    slug: 'character-creator',
    preview: 'Build your Daggerheart character step by step',
  },
];

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AutocompleteResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      if (query.length >= 2) {
        try {
          const data = await apiClient.autocomplete(query);
          // Also search tools client-side
          const lowerQuery = query.toLowerCase();
          const matchingTools = TOOLS.filter(
            tool =>
              tool.displayName.toLowerCase().includes(lowerQuery) ||
              tool.preview.toLowerCase().includes(lowerQuery)
          );
          // Put tools first, then API results
          setResults([...matchingTools, ...data]);
          setIsOpen(true);
          setSelectedIndex(-1);
        } catch (error) {
          console.error('Autocomplete error:', error);
          setResults([]);
        }
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 200);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPath = (result: AutocompleteResult) => {
    switch (result.type) {
      case 'class':
        return `/classes/${result.slug}`;
      case 'ancestry':
        return `/ancestries/${result.slug}`;
      case 'community':
        return `/communities/${result.slug}`;
      case 'domain':
        return `/domains/${result.slug}`;
      case 'weapon':
        return `/equipment/weapons/${result.slug}`;
      case 'armor':
        return `/equipment/armor/${result.slug}`;
      case 'mechanic':
        return `/mechanics/${result.slug}`;
      case 'tool':
        return `/tools/${result.slug}`;
      default:
        return '/';
    }
  };

  const handleSelect = (result: AutocompleteResult) => {
    navigate(getPath(result));
    setQuery('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        } else if (query.trim()) {
          navigate(`/search?q=${encodeURIComponent(query)}`);
          setQuery('');
          setIsOpen(false);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  const getTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className="search-container">
      <div className="search-input-wrapper">
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Search rules, classes, mechanics..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
        />
        <span className="search-icon">🔍</span>
      </div>

      {isOpen && results.length > 0 && (
        <div ref={dropdownRef} className="search-dropdown">
          {results.map((result, index) => (
            <button
              key={`${result.type}-${result.slug}`}
              className={`search-result ${index === selectedIndex ? 'selected' : ''}`}
              onClick={() => handleSelect(result)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className="search-result-header">
                <span className="search-result-name">{result.displayName}</span>
                <span className="search-result-type">{getTypeLabel(result.type)}</span>
              </div>
              {result.preview && (
                <p className="search-result-preview">{result.preview}</p>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
