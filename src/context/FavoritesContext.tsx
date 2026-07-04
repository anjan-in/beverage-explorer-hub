
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the slim data structure we need to display a favorited card
export interface FavoriteDrink {
  idDrink: string;
  strDrink: string;
  strDrinkThumb: string;
  strCategory: string;
  strAlcoholic: string;
}

interface FavoritesContextType {
  favorites: FavoriteDrink[];
  addFavorite: (drink: FavoriteDrink) => void;
  removeFavorite: (idDrink: string) => void;
  isFavorite: (idDrink: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteDrink[]>(() => {
    // Initialize state directly from localStorage if it exists
    const saved = localStorage.getItem('brewHoundFavorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Keep localStorage synced whenever the favorites array changes
  useEffect(() => {
    localStorage.setItem('brewHoundFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (drink: FavoriteDrink) => {
    setFavorites((prev) => [...prev, drink]);
  };

  const removeFavorite = (idDrink: string) => {
    setFavorites((prev) => prev.filter((item) => item.idDrink !== idDrink));
  };

  const isFavorite = (idDrink: string) => {
    return favorites.some((item) => item.idDrink === idDrink);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Custom wrapper hook for easy usage across our pages
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};