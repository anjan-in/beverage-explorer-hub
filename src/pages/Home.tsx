// src/pages/Home.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { InteractiveCharts } from '../components/InteractiveCharts';
import { Sparkles, Flame, ArrowRight, Compass, Heart, Zap, Layers } from 'lucide-react';

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

  useEffect(() => {
    const fetchSpotlight = async () => {
      try {
        const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita');
        const data = await response.json();
        setSpotlightDrinks(data.drinks ? data.drinks.slice(0, 3) : []);
      } catch (err) {
        console.error('Failed to load spotlight items');
      } finally {
        setLoading(false);
      }
    };
    fetchSpotlight();
  }, []);

  const recentFavorites = favorites.slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-16 transition-colors duration-300">
      
      {/* 1. Hero Glassmorphic Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white py-20 px-6 shadow-xl border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_50%)] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-xs font-semibold text-blue-300 tracking-wide uppercase mb-6 backdrop-blur-md">
            <Zap className="w-3.5 h-3.5 text-blue-400" /> Executive Mixology Dashboard
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-6 leading-tight max-w-3xl">
            Explore <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">Dynamic Recipes</span> & Live Analytics
          </h1>

          <p className="text-slate-300 text-base md:text-lg max-w-2xl mb-10 leading-relaxed font-light">
            An enterprise-ready beverage management portal with persistent local state, client-side category filters, and real-time taste profile telemetry.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/explore"
              className="flex items-center gap-2 px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 hover:scale-[1.02] active:scale-95 transition transform duration-200"
            >
              <Compass className="w-4 h-4" /> Open Explorer
            </Link>
            <Link
              to="/favorites"
              className="flex items-center gap-2 px-7 py-3.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/80 font-semibold rounded-xl backdrop-blur-md transition hover:scale-[1.02] active:scale-95"
            >
              <Heart className="w-4 h-4 text-red-400" /> View Cabinet ({favorites.length})
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 mt-12 space-y-12">
        
        {/* 2. Executive Analytics Section (If user has saved items) */}
        {favorites.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-500" /> Taste Profile Analytics
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Real-time telemetry derived from your saved cabinet.</p>
              </div>
            </div>
            
            <InteractiveCharts />
          </section>
        )}

        {/* 3. Quick Cabinet Shelf Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" /> Your Quick Shelf
            </h2>
            {favorites.length > 4 && (
              <Link to="/favorites" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                View All ({favorites.length}) <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {favorites.length === 0 ? (
            <div className="bg-white/60 dark:bg-slate-900/60 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-10 text-center shadow-sm backdrop-blur-md">
              <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">Your Cabinet is Empty</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
                Explore hundreds of cocktail recipes, tap the heart icon on your favorite items, and unlock live telemetry charts right here!
              </p>
              <Link
                to="/explore"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-md transition"
              >
                <Compass className="w-4 h-4" /> Start Exploring
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {recentFavorites.map((drink) => (
                <Link
                  key={drink.idDrink}
                  to={`/beverage/${drink.idDrink}`}
                  className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col"
                >
                  <div className="relative overflow-hidden h-36">
                    <img
                      src={drink.strDrinkThumb}
                      alt={drink.strDrink}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  <div className="p-3.5 flex-grow flex flex-col justify-between">
                    <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      {drink.strCategory}
                    </span>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate mt-0.5">
                      {drink.strDrink}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* 4. Featured Spotlight Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" /> Featured Classics
            </h2>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white dark:bg-slate-900 h-28 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {spotlightDrinks.map((drink) => (
                <div
                  key={drink.idDrink}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex items-center p-4 gap-4"
                >
                  <img
                    src={drink.strDrinkThumb}
                    alt={drink.strDrink}
                    className="w-20 h-20 object-cover rounded-xl shadow-sm flex-shrink-0"
                  />
                  <div className="flex-grow min-w-0">
                    <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                      {drink.strCategory}
                    </span>
                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 truncate mb-2">
                      {drink.strDrink}
                    </h3>
                    <Link
                      to={`/beverage/${drink.idDrink}`}
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 bg-blue-50 dark:bg-blue-950/50 px-3 py-1.5 rounded-lg transition inline-flex items-center gap-1"
                    >
                      Recipe Details <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};