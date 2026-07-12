// src/components/Navbar.tsx
import { Link, useLocation } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useTheme } from '../context/ThemeContext';
import { Zap, Compass, Wine, Moon, Sun } from 'lucide-react';

export const Navbar = () => {
  const { favorites } = useFavorites();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 sticky top-0 z-50 shadow-sm transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand Logo with Zap Icon */}
        <Link to="/" className="flex items-center space-x-2 group">
          <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
          <span className="text-xl font-bold text-gray-800 dark:text-slate-100 tracking-tight">
            Brew<span className="text-blue-600 dark:text-blue-400">Hound</span>
          </span>
        </Link>

        {/* Navigation Links with Compass and Wine Icons */}
        <div className="flex items-center space-x-6 font-medium text-sm">
          <Link
            to="/explore"
            className={`flex items-center gap-1.5 transition ${
              isActive('/explore') ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-slate-100'
            }`}
          >
            <Compass className="w-4 h-4" />
            Explore
          </Link>

          <Link
            to="/favorites"
            className={`flex items-center gap-1.5 transition ${
              isActive('/favorites') ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-slate-100'
            }`}
          >
            <Wine className="w-4 h-4" />
            Cabinet
            {favorites.length > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400 rounded-full">
                {favorites.length}
              </span>
            )}
          </Link>

          {/* Theme Switch Button with Smooth Rotation */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:scale-105 active:scale-95 transition-all border border-transparent dark:border-slate-700"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-gray-600" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};