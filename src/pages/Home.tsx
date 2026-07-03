
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';

interface SpotlightDrink {
  idDrink: string;
  strDrink: string;
  strDrinkThumb: string;
  strCategory: string;
}

export const Home = () => {
  const { favorites } = useFavorites();
  const [spotlightDrinks, setSpotlightDrinks] = useState<SpotlightDrink[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch a few popular dynamic recommendations on mount
  useEffect(() => {
    const fetchSpotlight = async () => {
      try {
        // Querying for popular/classic items by searching a standard keyword
        const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=mojito');
        const data = await response.json();
        // Take the top 3 items for a clean showcase block
        setSpotlightDrinks(data.drinks ? data.drinks.slice(0, 3) : []);
      } catch (err) {
        console.error('Failed to load spotlight items');
      } finally {
        setLoading(false);
      }
    };
    fetchSpotlight();
  }, []);

  // Limit display to the last 4 favorited items for a clean homepage row
  const recentFavorites = favorites.slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* 1. Hero Showcase Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white py-16 px-6 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
          <span className="px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-xs font-semibold text-blue-300 tracking-wide uppercase mb-4 animate-pulse">
            v2.0 Architecture
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Craft Your Perfect Drink Strategy
          </h1>
          <p className="text-slate-300 text-base md:text-lg max-w-2xl mb-8 leading-relaxed">
            Explore hundreds of dynamic recipes with persistent local state updates, network throttling, and live API synchronizations.
          </p>
          <div className="flex gap-4">
            <Link
              to="/explore"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl shadow-lg hover:bg-blue-700 hover:scale-[1.02] transition transform duration-150"
            >
              Open Explorer
            </Link>
            <Link
              to="/favorites"
              className="px-6 py-3 bg-slate-800 text-slate-200 border border-slate-700 font-medium rounded-xl hover:bg-slate-700 transition"
            >
              View My Cabinet
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-12 space-y-12">
        {/* 2. Dynamic Shelf Section (Driven by Context state) */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <span>🌟</span> Your Quick Shelf
            </h2>
            {favorites.length > 4 && (
              <Link to="/favorites" className="text-xs font-semibold text-blue-600 hover:underline">
                View All ({favorites.length}) →
              </Link>
            )}
          </div>

          {favorites.length === 0 ? (
            <div className="bg-white border border-dashed border-gray-300 rounded-xl p-8 text-center text-sm text-gray-500 shadow-sm">
              No items pinned yet. Go to the Explorer page and tap the heart icon to watch them load here in real time.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {recentFavorites.map((drink) => (
                <Link
                  key={drink.idDrink}
                  to={`/beverage/${drink.idDrink}`}
                  className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
                >
                  <div className="relative overflow-hidden h-32">
                    <img
                      src={drink.strDrinkThumb}
                      alt={drink.strDrink}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="p-3 flex-grow flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">
                      {drink.strCategory}
                    </span>
                    <h3 className="text-sm font-bold text-gray-800 truncate mt-0.5">
                      {drink.strDrink}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* 3. Spotlight Curated Section (Driven by API loading) */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span>🔥</span> Featured Classics
          </h2>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white h-48 rounded-xl border border-gray-200 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {spotlightDrinks.map((drink) => (
                <div
                  key={drink.idDrink}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex items-center p-4 gap-4 hover:shadow-md transition"
                >
                  <img
                    src={drink.strDrinkThumb}
                    alt={drink.strDrink}
                    className="w-20 h-20 object-cover rounded-lg shadow-sm flex-shrink-0"
                  />
                  <div className="flex-grow min-w-0">
                    <span className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wider block">
                      {drink.strCategory}
                    </span>
                    <h3 className="text-base font-bold text-gray-800 truncate mb-2">
                      {drink.strDrink}
                    </h3>
                    <Link
                      to={`/beverage/${drink.idDrink}`}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md transition inline-block"
                    >
                      View Recipe
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};