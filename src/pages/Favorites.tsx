import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GlassWater, Download, FileJson, Printer, Trash2, ArrowLeft 
} from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { InteractiveCharts } from '../components/InteractiveCharts';

export const Favorites = () => {
  const { favorites, removeFavorite } = useFavorites();
  const [showExportMenu, setShowExportMenu] = useState<boolean>(false);

  // 1. Export as JSON backup file
  const handleExportJSON = () => {
    const exportData = {
      app: 'BrewHound Enterprise',
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      totalItems: favorites.length,
      cabinet: favorites,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `brewhound-cabinet-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  // 2. Export / Print as a PDF Spec Sheet
  const handlePrintPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>BrewHound Cabinet Specification Sheet</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 32px; color: #0f172a; }
            h1 { font-size: 24px; margin-bottom: 4px; }
            p.sub { font-size: 12px; color: #64748b; margin-bottom: 24px; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            th, td { text-align: left; padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
            th { background: #f8fafc; font-weight: bold; color: #334155; }
            .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; background: #e0e7ff; color: #3730a3; }
          </style>
        </head>
        <body>
          <h1>⚡ BrewHound — Cabinet Recipe Manifest</h1>
          <p class="sub">Generated on ${new Date().toLocaleDateString()} • Total Saved Recipes: ${favorites.length}</p>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Cocktail Name</th>
                <th>Category</th>
                <th>Proof Type</th>
              </tr>
            </thead>
            <tbody>
              ${favorites
                .map(
                  (d, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td><strong>${d.strDrink}</strong></td>
                  <td>${d.strCategory}</td>
                  <td><span class="badge">${d.strAlcoholic}</span></td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
    setShowExportMenu(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-6 md:p-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        
        {/* Header with Navigation & Export Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <Link to="/" className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mb-1">
              <ArrowLeft className="w-4 h-4" /> Back Home
            </Link>
            <h1 className="text-3xl font-black tracking-tight">Your Cabinet</h1>
            <p className="text-xs text-slate-400 mt-1">Curated collection of your custom beverage mixology specs.</p>
          </div>

          {favorites.length > 0 && (
            <div className="relative self-start sm:self-auto">
              <button
                onClick={() => setShowExportMenu((prev) => !prev)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 shadow-sm hover:border-slate-300 transition"
              >
                <Download className="w-4 h-4 text-blue-500" /> Export Cabinet
              </button>

              <AnimatePresence>
                {showExportMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-1.5 z-30"
                  >
                    <button
                      onClick={handleExportJSON}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition text-left"
                    >
                      <FileJson className="w-4 h-4 text-amber-500" /> Export JSON File
                    </button>
                    <button
                      onClick={handlePrintPDF}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition text-left"
                    >
                      <Printer className="w-4 h-4 text-blue-500" /> Save / Print PDF
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Empty State */}
        {favorites.length === 0 ? (
          <div className="bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto shadow-sm backdrop-blur-md mt-10">
            <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200 dark:border-slate-700">
              <GlassWater className="w-7 h-7 text-slate-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Your cabinet is empty</h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-6">
              You haven't saved any cocktails to your shelf yet. Start exploring and click the favorite heart to build your collection.
            </p>
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 transition active:scale-95"
            >
              Explore Recipes
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Embedded Recharts Telemetry Section */}
            <InteractiveCharts />

            {/* Saved Drinks Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {favorites.map((drink) => (
                  <motion.div
                    key={drink.idDrink}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ y: -6, scale: 1.01 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden flex flex-col group shadow-sm transition-colors duration-300"
                  >
                    <img src={drink.strDrinkThumb} alt={drink.strDrink} className="w-full h-48 object-cover" />
                    <div className="p-4 flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-extrabold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                            {drink.strCategory}
                          </span>
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {drink.strAlcoholic}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4 truncate">
                          {drink.strDrink}
                        </h3>
                      </div>

                      <div className="space-y-2">
                        <Link
                          to={`/beverage/${drink.idDrink}`}
                          className="block w-full text-center py-2 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl transition text-xs"
                        >
                          View Recipe
                        </Link>
                        <button
                          onClick={() => removeFavorite(drink.idDrink)}
                          className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};