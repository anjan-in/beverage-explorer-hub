import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // 1. Import
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { BeverageDetails } from './pages/BeverageDetails';
import { Favorites } from './pages/Favorites';
import { FavoritesProvider } from './context/FavoritesContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { ErrorBoundary } from './components/ErrorBoundary';

// 2. Initialize the client with standard defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes before silent re-fetching
      gcTime: 1000 * 60 * 10,    // Unused queries are garbage-collected after 10 minutes
      retry: 1,                 // Retry failed requests once before showing the error boundary
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}> {/* 3. Wrap everything */}
      <ThemeProvider>
        <FavoritesProvider>
          <BrowserRouter>
            <Navbar /> 
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
    </QueryClientProvider>
  );
}
export default App;