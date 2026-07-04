import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

interface DetailedBeverage {
  idDrink: string;
  strDrink: string;
  strDrinkThumb: string;
  strCategory: string;
  strAlcoholic: string;
  strGlass: string;
  strInstructions: string;
  [key: string]: string | null; // Index signature to allow dynamic ingredient loops
}

export const BeverageDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [drink, setDrink] = useState<DetailedBeverage | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchDrinkDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`
        );
        const data = await response.json();
        if (data.drinks && data.drinks.length > 0) {
          setDrink(data.drinks[0]);
        } else {
          setError('Beverage details not found.');
        }
      } catch (err) {
        setError('Failed to load beverage details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDrinkDetails();
    }
  }, [id]);

  // Helper function to extract up to 15 ingredients and measurements from the API response
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

  if (loading) return <div className="text-center mt-12 text-gray-600">Loading recipe details...</div>;
  if (error) return <div className="text-center mt-12 text-red-500 font-medium">{error}</div>;
  if (!drink) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 p-6 md:p-10 transition-colors duration-300">
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden mt-6">
        <div className="p-4 bg-slate-100 border-b border-gray-200 dark:bg-slate-800 dark:border-slate-800">
          <Link to="/explore" className="text-blue-600 hover:underline text-sm">← Back to Explore</Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 transition-colors duration-300 bg-white dark:bg-slate-900">
          {/* Image Column */}
          <div>
            <img 
              src={drink.strDrinkThumb} 
              alt={drink.strDrink} 
              className="w-full h-auto object-cover rounded-xl shadow-inner"
            />
          </div>

          {/* Text Content Column */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex gap-2 mb-2">
                <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded uppercase dark:bg-slate-800 dark:text-slate-300">
                  {drink.strCategory}
                </span>
                <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded uppercase dark:bg-slate-800 dark:text-slate-300">
                  {drink.strAlcoholic}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-300 mb-4">{drink.strDrink}</h1>
              
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Served In</h3>
                <p className="text-gray-700 font-medium">{drink.strGlass}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Ingredients</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  {getIngredients().map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Instructions</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{drink.strInstructions}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};