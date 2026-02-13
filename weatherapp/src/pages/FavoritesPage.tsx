import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites';
import '../styles/FavoritesPage.css';

interface WeatherResponse {
  name: string;
  sys: {
    country: string;
  };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
}

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites();
  const [weatherData, setWeatherData] = useState<Map<string, WeatherResponse>>(new Map());
  const [loading, setLoading] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{city: string; state: string} | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Load weather for all favorites on component mount
  useEffect(() => {
    if (favorites.length > 0) {
      favorites.forEach((favorite) => {
        const key = `${favorite.city},${favorite.state}`;
        if (!weatherData.has(key)) {
          handleFetchWeather(favorite.city, favorite.state);
        }
      });
    }
  }, [favorites.length]);

  const handleFetchWeather = async (city: string, state: string) => {
    const key = `${city},${state}`;
    
    // If already loaded, don't fetch again
    if (weatherData.has(key)) return;

    setLoading((prev) => new Set(prev).add(key));
    setError(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/weather', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ city, state }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch weather for ${city}, ${state}`);
      }

      const data = await response.json();
      setWeatherData((prev) => new Map(prev).set(key, data));
    } catch (err) {
      setError((err as Error).message || 'Failed to fetch weather data');
    } finally {
      setLoading((prev) => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    }
  };

  const handleRemoveFavorite = (city: string, state: string) => {
    removeFavorite(city, state);
    const key = `${city},${state}`;
    setWeatherData((prev) => {
      const newMap = new Map(prev);
      newMap.delete(key);
      return newMap;
    });
    setDeleteConfirmation(null);
  };

  const getWeatherIcon = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
  };

  // Filter favorites based on search term
  const filteredFavorites = favorites.filter((favorite) =>
    favorite.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    favorite.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (favorites.length === 0) {
    return (
      <div className="favorites-page">
        <h1>⭐ Favorite Cities</h1>
        <div className="empty-state">
          <p>You haven't added any favorite cities yet!</p>
          <p>Search for a city and click the star icon to add it to your favorites.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <div className="page-header">
        <Link to="/welcome" className="back-link">
          ← Back to Home
        </Link>
      </div>
      <h1>⭐ Favorite Cities Weather</h1>
      
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search by city name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredFavorites.length === 0 && searchTerm && (
        <div className="no-results">
          <p>No cities found matching "{searchTerm}"</p>
        </div>
      )}
      
      {error && <div className="error-message">{error}</div>}

      <div className="weather-boxes-container">
        {filteredFavorites.map((favorite) => {
          const key = `${favorite.city},${favorite.state}`;
          const weather = weatherData.get(key);
          const isLoading = loading.has(key);

          return (
            <div key={key} className="weather-box">
              <div className="box-header">
                <h2>{favorite.city}</h2>
                <button
                  className="remove-btn"
                  onClick={() => setDeleteConfirmation(favorite)}
                  title="Remove from favorites"
                >
                  ×
                </button>
              </div>

              {isLoading && (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Loading weather...</p>
                </div>
              )}

              {weather && !isLoading && (
                <>
                  <div className="weather-main-display">
                    <div className="temp-section">
                      <img
                        src={getWeatherIcon(weather.weather[0].icon)}
                        alt={weather.weather[0].description}
                        className="weather-icon-large"
                      />
                      <div className="temperature-display">
                        <span className="temp-value">{Math.round(weather.main.temp)}°</span>
                        <span className="temp-unit">C</span>
                      </div>
                    </div>
                    <div className="weather-summary">
                      <p className="condition">{weather.weather[0].main}</p>
                      <p className="description">{weather.weather[0].description}</p>
                      <p className="country">{weather.sys.country}</p>
                    </div>
                  </div>

                  <div className="weather-details-grid">
                    <div className="detail-item">
                      <span className="detail-icon">🌡️</span>
                      <span className="detail-label">Feels Like</span>
                      <span className="detail-value">{Math.round(weather.main.feels_like)}°</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">💧</span>
                      <span className="detail-label">Humidity</span>
                      <span className="detail-value">{weather.main.humidity}%</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">💨</span>
                      <span className="detail-label">Wind</span>
                      <span className="detail-value">{weather.wind.speed} m/s</span>
                    </div>
                  </div>
                </>
              )}

              {deleteConfirmation?.city === favorite.city && deleteConfirmation?.state === favorite.state && (
                <div className="delete-confirmation">
                  <p>Remove {favorite.city}, {favorite.state} from favorites?</p>
                  <div className="confirmation-buttons">
                    <button
                      className="confirm-btn"
                      onClick={() => handleRemoveFavorite(favorite.city, favorite.state)}
                    >
                      Yes
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={() => setDeleteConfirmation(null)}
                    >
                      No
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
