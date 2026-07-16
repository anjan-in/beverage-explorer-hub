import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Search, Filter, Wine, GlassWater, Layers, HelpCircle } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useDebounce } from '../hooks/useDebounce';
import { useQuery } from '@tanstack/react-query';
import { BeverageSkeleton } from '../components/BeverageSkeleton';

interface Beverage {
  idDrink: string;
  strDrink: string;
  strDrinkThumb: string;
  strCategory: string;
  strAlcoholic: string;
}

// 1. Extract fetch logic to an independent, clean async function
const fetchBeverages = async (query: string): Promise<Beverage[]> => {
  const searchParam = query.trim() || 'a';
  const response = await fetch(
    `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchParam}`
  );
  if (!response.ok) {
    throw new Error('Network error loading beverages');
  }
  const data = await response.json();
  return data.drinks || [];
};

// 2. Predefined filter pill configuration with semantic vector icons
const FILTER_CATEGORIES = [
  { id: 'all', label: 'All Categories', icon: Filter },
  { id: 'cocktail', label: 'Cocktail', icon: Wine },
  { id: 'ordinary drink', label: 'Ordinary Drink', icon: GlassWater },
  { id: 'shot', label: 'Shot', icon: Layers },
  { id: 'other', label: 'Other', icon: HelpCircle },
];

export const Explore = () => {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // 3. Let TanStack Query manage fetching and caching automatically
  const { data: beverages = [], isPending, isError } = useQuery({
    queryKey: ['beverages', debouncedSearchTerm, selectedCategory], // Unique key + dependency query
    queryFn: () => fetchBeverages(debouncedSearchTerm),
  });

  // 4. Client-side analytical filtering layer
  const filteredBeverages = beverages.filter((drink) => {
    if (selectedCategory === 'all') return true;
    
    const drinkCat = (drink.strCategory || '').toLowerCase();
    
    if (selectedCategory === 'other') {
      return !['cocktail', 'ordinary drink', 'shot'].includes(drinkCat);
    }
    
    return drinkCat === selectedCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 p-6 md:p-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <Link to="/" className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
              ← Back Home
            </Link>
            <h1 className="text-3xl font-bold mt-1">Explore Beverages</h1>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Type to search beverages..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                // Reset filtering context upon new keywords to maximize search space
                setSelectedCategory('all');
              }}
              className="pl-9 pr-4 py-2.5 border border-gray-300 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-100 w-full md:w-80 transition-colors"
            />
          </div>
        </div>

        {/* Filtering Category Slider Pills Row Container */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none -mx-4 px-4 md:mx-0 md:px-0">
          {FILTER_CATEGORIES.map((cat) => {
            const IconComponent = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-500/20 scale-[1.02]'
                    : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-600 dark:text-slate-400 hover:border-gray-300 dark:hover:border-slate-700'
                }`}
              >
                <IconComponent className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {isError && (
          <p className="text-center text-red-500 font-medium">
            Could not fetch recipes. Please check your network connection.
          </p>
        )}

        {isPending && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <BeverageSkeleton key={idx} />
            ))}
          </div>
        )}

        {!isPending && !isError && (
          filteredBeverages.length === 0 ? (
            <p className="text-center text-gray-500 text-lg mt-12">
              No matching beverages found in this category row. Try adjusting filters or your keyword query!
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredBeverages.map((drink) => (
                  <motion.div
                    key={drink.idDrink}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
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