// src/components/InteractiveCharts.tsx
import { useFavorites } from '../context/FavoritesContext';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { BarChart2, PieChart as PieIcon, Activity, Sparkles, ShieldCheck } from 'lucide-react';

export const InteractiveCharts = () => {
  const { favorites } = useFavorites();

  if (favorites.length === 0) return null;

  // 1. Process Category Breakdown
  const categoryMap = favorites.reduce((acc, drink) => {
    const cat = drink.strCategory || 'Other';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.entries(categoryMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const topCategory = categoryData[0]?.name || 'N/A';

  // 2. Process Alcoholic vs Non-Alcoholic Split
  const alcoholicCount = favorites.filter(
    (d) => d.strAlcoholic?.toLowerCase().includes('alcoholic') && !d.strAlcoholic?.toLowerCase().includes('non')
  ).length;
  const nonAlcoholicCount = favorites.length - alcoholicCount;
  const nonAlcoholicPercentage = Math.round((nonAlcoholicCount / favorites.length) * 100);

  const alcoholicData = [
    { name: 'Alcoholic', value: alcoholicCount, color: '#6366f1' }, // Indigo
    { name: 'Non-Alcoholic', value: nonAlcoholicCount, color: '#10b981' }, // Emerald
  ].filter((item) => item.value > 0);

  return (
    <div className="space-y-6 mb-6">
        {/* KPI Stat Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm flex items-center gap-4 hover:border-blue-500/50 transition-all duration-300">
            <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
                <Activity className="w-6 h-6" />
            </div>
            <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Curated</p>
                <h4 className="text-2xl font-black text-slate-800 dark:text-slate-100">{favorites.length} <span className="text-xs font-normal text-slate-400">Items</span></h4>
            </div>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm flex items-center gap-4 hover:border-indigo-500/50 transition-all duration-300">
            <div className="p-3 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
                <Sparkles className="w-6 h-6" />
            </div>
            <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Dominant Taste</p>
                <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 truncate max-w-[160px]">{topCategory}</h4>
            </div>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm flex items-center gap-4 hover:border-emerald-500/50 transition-all duration-300">
            <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
                <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Zero-Proof Ratio</p>
                <h4 className="text-2xl font-black text-slate-800 dark:text-slate-100">{nonAlcoholicPercentage}% <span className="text-xs font-normal text-slate-400">Mocktails</span></h4>
            </div>
            </div>
        </div>

        {/* Interactive Recharts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Bar Chart */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-blue-500" />
                    Category Mix Breakdown
                    </h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                    Live State
                    </span>
                </div>
                
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                        <XAxis
                        dataKey="name"
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        interval={0}
                        angle={-15}
                        textAnchor="end"
                        />
                        <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                        <Tooltip
                        cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                        contentStyle={{
                            backgroundColor: '#0f172a',
                            borderColor: '#334155',
                            borderRadius: '0.75rem',
                            color: '#f8fafc',
                            fontSize: '12px',
                            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)',
                        }}
                        />
                        <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
                    </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Alcoholic vs Non-Alcoholic Pie Chart */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-emerald-500" />
                Proof Ratio Analytics
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                Volume %
                </span>
            </div>

            <div className="h-56 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                    data={alcoholicData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={6}
                    dataKey="value"
                    >
                    {alcoholicData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                    ))}
                    </Pie>
                    <Tooltip
                    contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '0.75rem',
                        color: '#f8fafc',
                        fontSize: '12px',
                    }}
                    />
                </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="flex justify-center gap-8 mt-2">
                {alcoholicData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.name}: <span className="font-bold text-slate-900 dark:text-slate-100">{item.value}</span>
                </div>
                ))}
            </div>
            </div>
        </div>
    </div>
  );
};