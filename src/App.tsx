import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { BeverageDetails } from './pages/BeverageDetails';
import { Favorites } from './pages/Favorites';
import { FavoritesProvider } from './context/FavoritesContext';
import { Navbar } from './components/Navbar';
import { ThemeProvider } from './context/ThemeContext';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <BrowserRouter>
          <Navbar /> 
          
          {/* Wrap all interactive page content switches inside the boundary */}
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/beverage/:id" element={<BeverageDetails />} />
              <Route path="/favorites" element={<Favorites />} />
            </Routes>
          </ErrorBoundary>
          
        </BrowserRouter>
      </FavoritesProvider>
    </ThemeProvider>
  );
}

export default App;