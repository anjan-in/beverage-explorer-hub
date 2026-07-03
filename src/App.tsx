import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { BeverageDetails } from './pages/BeverageDetails';
import { Favorites } from './pages/Favorites';
import { FavoritesProvider } from './context/FavoritesContext';
import { Navbar } from './components/Navbar';

function App() {
  return (
    <FavoritesProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/beverage/:id" element={<BeverageDetails />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </BrowserRouter>
    </FavoritesProvider>
  );
}
export default App;