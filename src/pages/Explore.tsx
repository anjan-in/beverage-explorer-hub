import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDebounce } from '../hooks/useDebounce';
import { BeverageSkeleton } from '../components/BeverageSkeleton';
import { useFavorites } from '../context/FavoritesContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

// 1. Define the TypeScript structure for a Beverage object from the API
interface Beverage {
  idDrink: string;
  strDrink: string;
  strDrinkThumb: string;
  strCategory: string;
  strAlcoholic: string;
}

export const Explore = () => {
  // 2. Define our React States
  const [beverages, setBeverages] = useState<Beverage[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  // 3. Create a reusable function to fetch data from the API
  const fetchBeverages = async (query: string) => {
    setLoading(true);
    setError('');
    try {
      // If query is empty, default to 'a' to show initial data
      const searchParam = query.trim() || 'a';
      const response = await fetch(
        `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchParam}`
      );
      const data = await response.json();
      
      // The API returns null if no drinks match the search
      setBeverages(data.drinks || []);
    } catch (err) {
      setError('Failed to fetch data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Trigger initial fetch when the page loads for the first time
  useEffect(() => {
    fetchBeverages(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  // 5. Handle Form Submission for search
  // const handleSearchSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   fetchBeverages(searchTerm);
  // };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 p-6 md:p-10 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Header Elements */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <Link to="/" className="text-sm text-blue-600 hover:underline">← Back Home</Link>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-300 mt-1">Explore Beverages</h1>
          </div>

          {/* Search Form */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Type to search beverages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 w-64 md:w-80 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300"
            />
          </div>
        </div>

        {/* Status Indicators */}
        {/* {loading && <p className="text-center text-gray-600 text-lg">Loading tasty drinks...</p>} */}
        {/* an array of skeletons matching the grid layout */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Create an arbitrary array of 8 elements to fill out a clean grid mockup */}
            {Array.from({ length: 8 }).map((_, index) => (
              <BeverageSkeleton key={index} />
            ))}
          </div>
        )}

        {error && <p className="text-center text-red-500 font-medium">{error}</p>}

        {/* Results Grid */}
        {/* Ensure the real data grid only renders when NOT loading and NO errors exist */}
        {!loading && !error && (
          beverages.length === 0 ? (
            <p className="text-center text-gray-500 text-lg mt-12">No beverages found. Try a different search!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {beverages.map((drink) => (
                  <motion.div
                    key={drink.idDrink}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    /* Framer Motion hover  */
                    whileHover={{ 
                      y: -8, 
                      scale: 1.01,
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col group transition-colors duration-300 my-2"
                  >
                    <img src={drink.strDrinkThumb} alt={drink.strDrink} className="w-full h-48 object-cover" />
                    <div className="p-4 flex-grow flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                          {drink.strCategory || 'Beverage'}
                        </span>
                        <h2 className="text-lg font-bold text-gray-800 dark:text-slate-200 mt-1 mb-4 truncate">
                          {drink.strDrink}
                        </h2>
                      </div>

                      {/* Upgraded Heart Pulse Spring Button */}
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => {
                          if (isFavorite(drink.idDrink)) {
                            removeFavorite(drink.idDrink);
                          } else {
                            addFavorite({
                              idDrink: drink.idDrink,
                              strDrink: drink.strDrink,
                              strDrinkThumb: drink.strDrinkThumb,
                              strCategory: drink.strCategory || 'Beverage',
                              strAlcoholic: drink.strAlcoholic || 'Alcoholic',
                            });
                          }
                        }}
                        className={`mb-2 w-full flex items-center justify-center gap-2 py-2 rounded-lg font-medium text-sm transition-colors duration-200 border ${
                          isFavorite(drink.idDrink)
                            ? 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/40'
                            : 'bg-slate-50 dark:bg-slate-800/60 text-gray-600 dark:text-slate-400 border-gray-200 dark:border-slate-700'
                        }`}
                      >
                        <Heart 
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isFavorite(drink.idDrink) ? 'fill-red-600 dark:fill-red-400 text-red-600 dark:text-red-400 scale-110' : 'text-gray-400 dark:text-slate-500'
                          }`} 
                        />
                        <span>{isFavorite(drink.idDrink) ? 'Favorited' : 'Add to Favorites'}</span>
                      </motion.button>

                      <Link
                        to={`/beverage/${drink.idDrink}`}
                        className="block w-full text-center py-2 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg transition text-sm"
                      >
                        View Details
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )
        )}
      </div>
    </div>
  );
};