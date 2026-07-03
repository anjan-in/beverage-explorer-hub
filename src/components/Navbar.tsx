
import { Link, useLocation } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';

export const Navbar = () => {
  const { favorites } = useFavorites();
  const location = useLocation();

  // Helper to check if a link is currently active to highlight it
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-gray-800 tracking-tight">
            ⚡ Brew<span className="text-blue-600">Hound</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6 font-medium text-sm">
          <Link
            to="/explore"
            className={`transition ${
              isActive('/explore') ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Explore Drinks
          </Link>

          <Link
            to="/favorites"
            className={`flex items-center gap-1.5 transition ${
              isActive('/favorites') ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Favorites ❤️
            {favorites.length > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold bg-red-100 text-red-600 rounded-full animate-pulse">
                {favorites.length}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};