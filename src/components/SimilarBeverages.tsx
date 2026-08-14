import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Sparkles, ArrowRight } from 'lucide-react';

interface DrinkSummary {
  idDrink: string;
  strDrink: string;
  strDrinkThumb: string;
}

interface Props {
  currentDrinkId: string;
  category: string;
}

const fetchSimilarBeverages = async (category: string): Promise<DrinkSummary[]> => {
  const response = await fetch(
    `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(category)}`
  );
  if (!response.ok) return [];
  const data = await response.json();
  return data.drinks || [];
};

export const SimilarBeverages = ({ currentDrinkId, category }: Props) => {
  const { data: drinks = [], isLoading } = useQuery({
    queryKey: ['similarBeverages', category],
    queryFn: () => fetchSimilarBeverages(category),
    enabled: !!category,
  });

  const filteredDrinks = drinks
    .filter((d) => d.idDrink !== currentDrinkId)
    .slice(0, 4);

  if (isLoading || filteredDrinks.length === 0) return null;

  return (
    <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" /> Similar {category} Pairings
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Recommended recipes based on flavor and category profile.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {filteredDrinks.map((drink) => (
          <Link
            key={drink.idDrink}
            to={`/beverage/${drink.idDrink}`}
            className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col"
          >
            <div className="relative overflow-hidden h-32">
              <img
                src={drink.strDrinkThumb}
                alt={drink.strDrink}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
            </div>
            <div className="p-3 flex-grow flex flex-col justify-between">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                {drink.strDrink}
              </h4>
              <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-0.5 mt-2">
                View Recipe <ArrowRight className="w-2.5 h-2.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};