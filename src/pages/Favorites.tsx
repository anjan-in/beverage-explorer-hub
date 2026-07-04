
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { TasteAnalytics } from '../components/TasteAnalytics';

export const Favorites = () => {
  const { favorites, removeFavorite } = useFavorites();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 p-6 md:p-10 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-300 mb-2">My Cabinet</h1>
        <p className="text-sm text-gray-500 mb-8">Your curated collection of saved dynamic recipes.</p>

        {favorites.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center max-w-md mx-auto shadow-sm mt-8 transition-colors duration-300 dark:bg-slate-900 dark:border-slate-800">
            <span className="text-4xl">🍹</span>
            <h2 className="text-xl font-bold text-gray-800 dark:text-slate-300 mt-4 mb-2">Your cabinet is empty</h2>
            <p className="text-gray-500 text-sm mb-6">
              You haven't added any beverages to your collection yet. Start exploring to save your favorites!
            </p>
            <Link
              to="/explore"
              className="inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-sm transition shadow-sm"
            >
              Explore Beverages
            </Link>
          </div>
        ) : (
          <>
            {/* Dynamic Analytics Row Placement */}
            <TasteAnalytics />
            {/* favorites card mapping grid below... */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {favorites.map((drink) => (
                <div
                  key={drink.idDrink}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-out flex flex-col group transition-colors duration-300 dark:bg-slate-900 dark:border-slate-800"
                >
                  <img src={drink.strDrinkThumb} alt={drink.strDrink} className="w-full h-48 object-cover" />
                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                        {drink.strCategory || 'Beverage'}
                      </span>
                      <h2 className="text-lg font-bold text-gray-800 dark:text-slate-300 mt-1 mb-4 line-clamp-1">{drink.strDrink}</h2>
                    </div>

                    <div className="space-y-2">
                      <Link
                        to={`/beverage/${drink.idDrink}`}
                        className="block w-full text-center py-2 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-medium rounded-lg transition text-sm dark:bg-slate-800 dark:hover:bg-blue-600 dark:text-slate-300 dark:hover:text-white"
                      >
                        View Recipe
                      </Link>
                      <button
                        onClick={() => removeFavorite(drink.idDrink)}
                        className="block w-full text-center py-2 text-red-500 hover:bg-red-50 font-medium rounded-lg transition text-xs border border-transparent hover:border-red-100"
                      >
                        Remove from Favorites
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};