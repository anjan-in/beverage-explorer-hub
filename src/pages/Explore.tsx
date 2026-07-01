import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDebounce } from '../hooks/useDebounce';

// 1. Define the TypeScript structure for a Beverage object from the API
interface Beverage {
  idDrink: string;
  strDrink: string;
  strDrinkThumb: string;
  strCategory: string;
}

export const Explore = () => {
  // 2. Define our React States
  const [beverages, setBeverages] = useState<Beverage[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

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
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Elements */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <Link to="/" className="text-sm text-blue-600 hover:underline">← Back Home</Link>
            <h1 className="text-3xl font-bold text-gray-800 mt-1">Explore Beverages</h1>
          </div>

          {/* Search Form */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type to search beverages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 w-64 md:w-80"
            />
          </div>
        </div>

        {/* Status Indicators */}
        {loading && <p className="text-center text-gray-600 text-lg">Loading tasty drinks...</p>}
        {error && <p className="text-center text-red-500 font-medium">{error}</p>}

        {/* Results Grid */}
        {!loading && !error && (
          beverages.length === 0 ? (
            <p className="text-center text-gray-500 text-lg mt-12">No beverages found. Try a different search!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {beverages.map((drink) => (
                <div 
                  key={drink.idDrink} 
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
                >
                  <img 
                    src={drink.strDrinkThumb} 
                    alt={drink.strDrink} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                        {drink.strCategory || 'Beverage'}
                      </span>
                      <h2 className="text-lg font-bold text-gray-800 mt-1 mb-4 line-clamp-1">
                        {drink.strDrink}
                      </h2>
                    </div>
                    {/* Link to Dynamic Route */}
                    <Link 
                      to={`/beverage/${drink.idDrink}`}
                      className="block w-full text-center py-2 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-medium rounded-lg transition text-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};