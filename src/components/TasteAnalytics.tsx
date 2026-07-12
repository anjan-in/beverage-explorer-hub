import { BarChart3 } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';

export const TasteAnalytics = () => {
  const { favorites } = useFavorites();

  if (favorites.length === 0) return null;

  const totalCount = favorites.length;

  // Calculate Category Stats
  const categoryCounts = favorites.reduce((acc, drink) => {
    const cat = drink.strCategory || 'Other';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const analyticsData = Object.entries(categoryCounts).map(([category, count]) => ({
    category,
    count,
    percentage: Math.round((count / totalCount) * 100),
  }));

  // Calculate Alcoholic Ratios
  const alcoholicCount = favorites.filter(d => d.strAlcoholic?.includes('Alcoholic')).length;
  const nonAlcoholicPercentage = Math.round(((totalCount - alcoholicCount) / totalCount) * 100);

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm mb-8 transition-colors duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 border-b border-gray-100 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800 dark:text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" /> 
            Cabinet Mixology Analytics
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">Real-time flavor profile metrics derived from your saved layout.</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-bold self-start sm:self-center">
          {totalCount} Total Items
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {/* Progress Category Trackers */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">Categories</h3>
          {analyticsData.map((item) => (
            <div key={item.category} className="space-y-1">
              <div className="flex justify-between items-center text-xs text-gray-700 dark:text-slate-300">
                <span className="font-semibold">{item.category}</span>
                <span className="font-mono">{item.count}x ({item.percentage}%)</span>
              </div>
              <div className="w-full h-2 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 dark:bg-blue-500 rounded-full" style={{ width: `${item.percentage}%` }}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Balance Ratio Section */}
        <div className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-gray-100 dark:border-slate-800 text-center flex flex-col justify-center h-full">
          <h3 className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">Sobriety Balance</h3>
          <div className="text-2xl font-black text-gray-800 dark:text-slate-200">{nonAlcoholicPercentage}%</div>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Non-Alcoholic Asset Selection Density</p>
          <div className="w-full h-1.5 bg-red-200 dark:bg-red-950/50 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-emerald-500" style={{ width: `${nonAlcoholicPercentage}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};