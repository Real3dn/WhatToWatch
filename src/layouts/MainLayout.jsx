import { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

export default function MainLayout() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const watchlistCount = useAppStore((state) => state.watchlist.length);
  const favoritesCount = useAppStore((state) => state.favorites.length);

  // Monitor scroll height to apply Netflix-style solid background on navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile navigation on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/trending', label: 'Trending' },
    { to: '/popular', label: 'Popular' },
    { to: '/top-rated', label: 'Top Rated' },
    { to: '/upcoming', label: 'Upcoming' },
    { to: '/genres', label: 'Browse Genres' },
  ];

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col font-sans antialiased">
      {/* Header / Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ease-in-out px-4 md:px-12 py-4 flex items-center justify-between ${
          isScrolled ? 'bg-zinc-950 shadow-md' : 'bg-gradient-to-b from-zinc-950/80 to-transparent'
        }`}
      >
        <div className="flex items-center gap-8">
          {/* Clickable Brand Logo */}
          <Link to="/" className="flex items-center gap-2 tracking-wide font-black text-xl md:text-2xl text-red-600 transition hover:scale-105">
            <span>Real3dn</span>
            <span className="text-white font-medium text-sm md:text-base border border-red-600 px-1.5 py-0.5 rounded bg-red-600/10">
              What To Watch
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-zinc-300">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `hover:text-white transition-colors duration-200 ${
                    isActive ? 'text-white font-bold' : ''
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Action controls (Search, Lists, Mobile menu toggle) */}
        <div className="flex items-center gap-4">
          {/* Quick Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
            <input
              type="text"
              placeholder="Titles, people, genres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-zinc-900/80 border border-zinc-700 text-sm rounded-full py-1.5 pl-4 pr-10 focus:outline-none focus:border-red-600 focus:bg-zinc-900 transition-all duration-300 w-48 focus:w-64"
            />
            <button type="submit" className="absolute right-3 top-2 text-zinc-400 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>

          {/* Favorites Link */}
          <Link to="/favorites" className="relative p-2 text-zinc-300 hover:text-red-500 transition-colors duration-200" title="Favorites">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {favoritesCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {favoritesCount}
              </span>
            )}
          </Link>

          {/* Watchlist Link */}
          <Link to="/watchlist" className="relative p-2 text-zinc-300 hover:text-yellow-500 transition-colors duration-200" title="Watchlist">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            {watchlistCount > 0 && (
              <span className="absolute top-0 right-0 bg-yellow-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {watchlistCount}
              </span>
            )}
          </Link>

          {/* Mobile Navigation Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-zinc-300 hover:text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay / Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-zinc-950/95 flex flex-col justify-center items-center gap-6 lg:hidden animate-fade-in">
          {/* Quick Search in mobile menu */}
          <form onSubmit={handleSearchSubmit} className="relative w-72 mb-4">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-zinc-950 border border-zinc-700 text-base rounded-full py-2 pl-4 pr-10 focus:outline-none focus:border-red-600 w-full"
            />
            <button type="submit" className="absolute right-3 top-2.5 text-zinc-400 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>

          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-xl font-medium tracking-wide hover:text-red-500 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-6 mt-4">
            <Link to="/favorites" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 text-zinc-400 hover:text-red-500">
              Favorites ({favoritesCount})
            </Link>
            <Link to="/watchlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 text-zinc-400 hover:text-yellow-500">
              Watchlist ({watchlistCount})
            </Link>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-grow pt-20 pb-16">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-zinc-950 text-zinc-500 text-center py-8 text-xs border-t border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Real3dn What To Watch. Powered by TMDB API. Built with React & Tailwind CSS.</p>
          <div className="flex gap-4">
            <Link to="/favorites" className="hover:text-white transition">Favorites</Link>
            <Link to="/watchlist" className="hover:text-white transition">Watchlist</Link>
            <Link to="/genres" className="hover:text-white transition">Browse</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
