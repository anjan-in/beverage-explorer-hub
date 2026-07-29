import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Search, Filter, Wine, GlassWater, Layers, HelpCircle, Dices, Flame 
} from 'lucide-react';
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

const FILTER_CATEGORIES = [
  { id: 'all', label: 'All Categories', icon: Filter },
  { id: 'cocktail', label: 'Cocktail', icon: Wine },
  { id: 'ordinary drink', label: 'Ordinary Drink', icon: GlassWater },
  { id: 'shot', label: 'Shot', icon: Layers },
  { id: 'other', label: 'Other', icon: HelpCircle },
];

type ProofFilter = 'all' | 'alcoholic' | 'non-alcoholic';

export const Explore = () => {
  const navigate = useNavigate();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  
  // Interactive Filter States
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [proofFilter, setProofFilter] = useState<ProofFilter>('all');
  const [isRollingDice, setIsRollingDice] = useState<boolean>(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: beverages = [], isPending, isError } = useQuery({
    queryKey: ['beverages', debouncedSearchTerm],
    queryFn: () => fetchBeverages(debouncedSearchTerm),
  });

  // "Surprise Me" Random Cocktail Roller Handler
  const handleSurpriseMe = async () => {
    try {
      setIsRollingDice(true);
      const res = await fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php');
      const data = await res.json();
      if (data.drinks && data.drinks[0]) {
        // Short pause to allow dice rolling animation to complete
        setTimeout(() => {
          navigate(`/beverage/${data.drinks[0].idDrink}`);
        }, 500);
      }
    } catch (err) {
      console.error('Failed to fetch random drink', err);
      setIsRollingDice(false);
    }
  };

  // Dual-tier Client-side Filtering Logic (Category + Proof Strength)
  const filteredBeverages = beverages.filter((drink) => {
    // 1. Proof Type Filter
    const drinkAlcoholicStr = (drink.strAlcoholic || '').toLowerCase();
    const isNonAlcoholic = drinkAlcoholicStr.includes('non');

    if (proofFilter === 'alcoholic' && isNonAlcoholic) return false;
    if (proofFilter === 'non-alcoholic' && !isNonAlcoholic) return false;

    // 2. Category Filter
    if (selectedCategory === 'all') return true;
    
    const drinkCat = (drink.strCategory || '').toLowerCase();
    
    if (selectedCategory === 'other') {
      return !['cocktail', 'ordinary drink', 'shot'].includes(drinkCat);
    }
    
    return drinkCat === selectedCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-6 md:p-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Block */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <Link to="/" className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
              ← Back Home
            </Link>
            <h1 className="text-3xl font-black mt-1 tracking-tight">Explore Beverages</h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input Box */}
            <div className="relative flex-grow sm:flex-grow-0">
              <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Type to search beverages..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSelectedCategory('all');
                }}
                className="pl-9 pr-4 py-2.5 border border-slate-300 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 w-full sm:w-72 transition-colors text-sm font-medium"
              />
            </div>

            {/* "Surprise Me" Random Cocktail Roller Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSurpriseMe}
              disabled={isRollingDice}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-500/20 transition-all duration-200 cursor-pointer"
            >
              <motion.div
                animate={isRollingDice ? { rotate: 360 } : { rotate: 0 }}
                transition={{ repeat: isRollingDice ? Infinity : 0, duration: 0.5, ease: "linear" }}
              >
                <Dices className="w-4 h-4 text-indigo-200" />
              </motion.div>
              <span>{isRollingDice ? 'Rolling...' : 'Surprise Me!'}</span>
            </motion.button>
          </div>
        </div>

        {/* Alcoholic / Non-Alcoholic Proof Segmented Control + Category Pills */}
        <div className="space-y-4 mb-8">
          
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white/60 dark:bg-slate-900/60 p-2 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md">
            
            {/* Proof Segmented Switch */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/60 dark:border-slate-800/60 text-xs font-semibold">
              <button
                onClick={() => setProofFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  proofFilter === 'all'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                All Proof
              </button>
              <button
                onClick={() => setProofFilter('alcoholic')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition ${
                  proofFilter === 'alcoholic'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Flame className="w-3 h-3 text-amber-400" /> Alcoholic
              </button>
              <button
                onClick={() => setProofFilter('non-alcoholic')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition ${
                  proofFilter === 'non-alcoholic'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Zero-Proof
              </button>
            </div>

            {/* Category Filter Pills Row */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none max-w-full">
              {FILTER_CATEGORIES.map((cat) => {
                const IconComponent = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 border cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-500/20'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    {cat.label}
                  </button>
                );
              })}
            </div>

          </div>

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
            <div className="bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center max-w-md mx-auto shadow-sm mt-8 backdrop-blur-md">
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
                No beverages match your current filter combination.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setProofFilter('all');
                  setSearchTerm('');
                }}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-blue-500 transition"
              >
                Reset All Filters
              </button>
            </div>
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
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden flex flex-col group transition-colors duration-300 my-1"
                  >
                    <img src={drink.strDrinkThumb} alt={drink.strDrink} className="w-full h-48 object-cover" />
                    <div className="p-4 flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-extrabold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                            {drink.strCategory || 'Beverage'}
                          </span>
                          <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                            (drink.strAlcoholic || '').toLowerCase().includes('non')
                              ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
                              : 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400'
                          }`}>
                            {drink.strAlcoholic}
                          </span>
                        </div>
                        <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4 truncate">
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
                        className={`mb-2 w-full flex items-center justify-center gap-2 py-2 rounded-xl font-semibold text-xs transition-colors duration-200 border ${
                          isFavorite(drink.idDrink)
                            ? 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/40'
                            : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <Heart 
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            isFavorite(drink.idDrink) ? 'fill-red-600 dark:fill-red-400 text-red-600 dark:text-red-400 scale-110' : 'text-slate-400 dark:text-slate-500'
                          }`} 
                        />
                        <span>{isFavorite(drink.idDrink) ? 'Favorited' : 'Add to Favorites'}</span>
                      </motion.button>

                      <Link
                        to={`/beverage/${drink.idDrink}`}
                        className="block w-full text-center py-2 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl transition text-xs"
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