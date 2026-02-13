import { useState, useEffect } from 'react';

export interface FavoriteCity {
  city: string;
  state: string;
  addedAt: number;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteCity[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('favoritesCities');
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to load favorites:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('favoritesCities', JSON.stringify(favorites));
    }
  }, [favorites, isLoaded]);

  const addFavorite = (city: string, state: string) => {
    const newFavorite: FavoriteCity = {
      city,
      state,
      addedAt: Date.now(),
    };

    setFavorites((prev) => {
      // Check if already exists
      const exists = prev.some(
        (fav) => fav.city.toLowerCase() === city.toLowerCase() && fav.state.toLowerCase() === state.toLowerCase()
      );
      if (exists) return prev;
      return [newFavorite, ...prev];
    });
  };

  const removeFavorite = (city: string, state: string) => {
    setFavorites((prev) =>
      prev.filter(
        (fav) => !(fav.city.toLowerCase() === city.toLowerCase() && fav.state.toLowerCase() === state.toLowerCase())
      )
    );
  };

  const isFavorite = (city: string, state: string): boolean => {
    return favorites.some(
      (fav) => fav.city.toLowerCase() === city.toLowerCase() && fav.state.toLowerCase() === state.toLowerCase()
    );
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    isLoaded,
  };
}
