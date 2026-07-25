// src/pages/BeverageDetails.tsx
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, GlassWater, HelpCircle, Share2, Check, Users, Sparkles } from 'lucide-react';
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

const fetchBeverageDetails = async (id: string): Promise<DetailedBeverage> => {
  const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
  if (!response.ok) throw new Error('Failed to load beverage recipe');
  const data = await response.json();
  if (!data.drinks || data.drinks.length === 0) throw new Error('Recipe not found');
  return data.drinks[0];
};

export const BeverageDetails = () => {
  const { id } = useParams<{ id: string }>();
  
  // Interactive States
  const [servings, setServings] = useState<number>(1);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<boolean>(false);

  const { data: drink, isPending, isError, error } = useQuery({
    queryKey: ['beverage', id],
    queryFn: () => fetchBeverageDetails(id || ''),
    enabled: !!id,
  });

  // Extract and scale ingredients dynamically
  const getScaledIngredients = () => {
    if (!drink) return [];
    const ingredients = [];
    
    for (let i = 1; i <= 15; i++) {
      const ingredient = drink[`strIngredient${i}`];
      const measure = drink[`strMeasure${i}`];
      
      if (ingredient) {
        let scaledMeasure = measure ? measure.trim() : '';
        
        // Attempt to parse numerical quantities for scaling multiplier
        if (scaledMeasure && servings > 1) {
          scaledMeasure = scaledMeasure.replace(/(\d+(\.\d+)?)/g, (match) => {
            const num = parseFloat(match);
            return (num * servings).toString();
          });
        }

        ingredients.push({
          id: `ing-${i}`,
          text: `${scaledMeasure} ${ingredient.trim()}`.trim(),
          name: ingredient.trim(),
        });
      }
    }
    return ingredients;
  };

  const toggleIngredient = (ingId: string) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [ingId]: !prev[ingId],
    }));
  };

  const handleShare = async () => {
    const shareData = {
      title: drink?.strDrink || 'Beverage Recipe',
      text: `Check out this recipe for ${drink?.strDrink} on BrewHound!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Fallback to copy link
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-500 animate-pulse">Formulating Mixology Spec Sheet...</p>
        </div>
      </div>
    );
  }

  if (isError) return <div className="text-center mt-24 text-red-500 font-medium">Error: {error.message}</div>;
  if (!drink) return null;

  const ingredientsList = getScaledIngredients();
  const completedCount = Object.values(checkedIngredients).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / (ingredientsList.length || 1)) * 100);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation & Action Bar */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Explorer
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/40 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition shadow-sm"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            {copied ? 'Link Copied!' : 'Share Recipe'}
          </button>
        </div>

        {/* Main Recipe Card Container */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
            
            {/* Left Image Column */}
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-2xl shadow-md group">
                <img
                  src={drink.strDrinkThumb}
                  alt={drink.strDrink}
                  className="w-full h-80 md:h-96 object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2.5 py-1 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-extrabold rounded-full uppercase tracking-wider">
                    {drink.strCategory}
                  </span>
                  <span className="px-2.5 py-1 bg-emerald-500/80 backdrop-blur-md text-white text-[10px] font-extrabold rounded-full uppercase tracking-wider">
                    {drink.strAlcoholic}
                  </span>
                </div>
              </div>

              {/* Glassware Info Badge */}
              <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 flex items-center gap-3">
                <div className="p-2.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg">
                  <GlassWater className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recommended Vessel</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{drink.strGlass}</p>
                </div>
              </div>
            </div>

            {/* Right Interactive Formula Column */}
            <div className="flex flex-col justify-between space-y-6">
              <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight mb-4">
                  {drink.strDrink}
                </h1>

                {/* Serving Scaler Control */}
                <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 mb-6 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-blue-500" /> Servings Multiplier
                    </span>
                    <span className="px-2 py-0.5 bg-blue-600 text-white rounded-full text-[11px]">
                      {servings} {servings === 1 ? 'Glass' : 'Glasses'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 4, 8].map((num) => (
                      <button
                        key={num}
                        onClick={() => setServings(num)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                          servings === num
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                        }`}
                      >
                        {num}×
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interactive Ingredients Checklist */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-indigo-500" /> Ingredients Checklist
                    </h3>
                    <span className="text-[11px] font-mono font-bold text-slate-500">
                      {completedCount}/{ingredientsList.length} Ready
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  {/* Checklist Items */}
                  <div className="space-y-1.5 pt-1">
                    {ingredientsList.map((ing) => {
                      const isChecked = !!checkedIngredients[ing.id];
                      return (
                        <div
                          key={ing.id}
                          onClick={() => toggleIngredient(ing.id)}
                          className={`flex items-center gap-3 p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition ${
                            isChecked
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400 line-through opacity-75'
                              : 'bg-slate-50/50 dark:bg-slate-950/40 border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-md border flex items-center justify-center transition ${
                              isChecked
                                ? 'bg-emerald-500 border-emerald-500 text-white'
                                : 'border-slate-300 dark:border-slate-700'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span>{ing.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Instructions Block */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Preparation Procedure
                  </h3>
                  <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                    {drink.strInstructions}
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};