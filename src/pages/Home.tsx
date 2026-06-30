import { Link } from 'react-router-dom';

export const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">BrewHound</h1>
      <p className="text-gray-600 mb-6">Discover your next favorite beverage.</p>
      <Link 
        to="/explore" 
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
      >
        Explore Drinks
      </Link>
    </div>
  );
};