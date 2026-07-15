import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, GlassWater, HelpCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface DetailedBeverage {
  idDrink: string;
  strDrink: string;
  strDrinkThumb: string;
  strCategory: string;
  strAlcoholic: string;
  strGlass: string;
  strInstructions: string;
  [key: string]: string | null;
}

// 2. Define clean fetching utility
const fetchBeverageDetails = async (id: string): Promise<DetailedBeverage> => {
  const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
  if (!response.ok) {
    throw new Error('Failed to load beverage recipe');
  }
  const data = await response.json();
  if (!data.drinks || data.drinks.length === 0) {
    throw new Error('Recipe not found');
  }
  return data.drinks[0];
};

export const BeverageDetails = () => {
  const { id } = useParams<{ id: string }>();

  // 3. Connect to the Cache
  const { data: drink, isPending, isError, error } = useQuery({
    queryKey: ['beverage', id], // Cached uniquely per cocktail ID
    queryFn: () => fetchBeverageDetails(id || ''),
    enabled: !!id, // Only run the query if an ID is active in the URL parameter
  });

  const getIngredients = () => {
    if (!drink) return [];
    const ingredients = [];
    for (let i = 1; i <= 15; i++) {
      const ingredient = drink[`strIngredient${i}`];
      const measure = drink[`strMeasure${i}`];
      if (ingredient) {
        ingredients.push(`${measure ? measure.trim() : ''} ${ingredient.trim()}`);
      }
    }
    return ingredients;
  };

  if (isPending) return <div className="text-center mt-24 text-gray-600 dark:text-slate-400 animate-pulse">Loading recipe details...</div>;
  if (isError) return <div className="text-center mt-24 text-red-500 font-medium">Error: {error.message}</div>;
  if (!drink) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 p-6 md:p-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden mt-6 transition-colors duration-300">
        <div className="p-4 bg-slate-100 dark:bg-slate-800/40 border-b border-gray-200 dark:border-slate-800 flex items-center">
          <Link to="/explore" className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to Explore
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          <div>
            <img 
              src={drink.strDrinkThumb} 
              alt={drink.strDrink} 
              className="w-full h-auto object-cover rounded-xl shadow-md"
            />
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <div className="flex gap-2 mb-2">
                <span className="px-2 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded uppercase">
                  {drink.strCategory}
                </span>
                <span className="px-2 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded uppercase">
                  {drink.strAlcoholic}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-4">{drink.strDrink}</h1>
              
              <div className="mb-6">
                <h3 className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <GlassWater className="w-3.5 h-3.5" /> Served In
                </h3>
                <p className="text-gray-700 dark:text-slate-300 font-medium">{drink.strGlass}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5" /> Ingredients
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-slate-300">
                  {getIngredients().map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">Instructions</h3>
                <p className="text-gray-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">{drink.strInstructions}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};