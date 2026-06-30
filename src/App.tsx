import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { BeverageDetails } from './pages/BeverageDetails';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/beverage/:id" element={<BeverageDetails />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;