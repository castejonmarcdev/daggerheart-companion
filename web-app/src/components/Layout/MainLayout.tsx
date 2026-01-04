import { Outlet, Link } from 'react-router-dom';
import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { SearchBar } from '../Search/SearchBar';

export function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="app-layout">
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <button
              className="mobile-menu-toggle"
              onClick={toggleMobileMenu}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}>
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>
            <Link to="/" className="header-title">
              <span className="header-icon">⚔️</span>
              <h1>Daggerheart Companion</h1>
            </Link>
          </div>
          <SearchBar />
        </div>
      </header>
      <div className="app-body">
        {mobileMenuOpen && (
          <div className="mobile-menu-overlay" onClick={closeMobileMenu} />
        )}
        <Sidebar isOpen={mobileMenuOpen} onClose={closeMobileMenu} />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
