

import React, { useState, useEffect } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import Forecast from './components/Forecast';
import FavoriteCities from './components/FavoriteCities';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favoriteCities');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const [defaultCities, setDefaultCities] = useState([]);

  useEffect(() => {
    localStorage.setItem('favoriteCities', JSON.stringify(favorites));
  }, [favorites]);
  
 
  useEffect(() => {
    async function fetchDefaultCities() {
      try {
        const response = await fetch('/api/default-cities');
        if (response.ok) {
          const data = await response.json();
          setDefaultCities(data.cities);
        }
      } catch (err) {
        console.error('Error fetching default cities:', err);
      }
    }
    
    fetchDefaultCities();
  }, []);

  const fetchWeatherData = async (city) => {
    setLoading(true);
    setError(null);
    
    try {
    
      const weatherResponse = await fetch(`/api/weather/${city}`);
      
      if (!weatherResponse.ok) {
        const errorData = await weatherResponse.json();
        throw new Error(errorData.message || 'Failed to fetch weather data');
      }
      
      const weatherResult = await weatherResponse.json();
      setWeatherData(weatherResult);
      
      
      const forecastResponse = await fetch(`/api/forecast/${city}`);
      
      if (!forecastResponse.ok) {
        throw new Error('Failed to fetch forecast data');
      }
      
      const forecastResult = await forecastResponse.json();
      setForecastData(forecastResult);
      
    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = (city) => {
    if (!favorites.includes(city)) {
      setFavorites([...favorites, city]);
    }
  };

  const removeFromFavorites = (city) => {
    setFavorites(favorites.filter(fav => fav !== city));
  };
  
  
  const handleSearch = async (searchTerm) => {
    if (searchTerm.trim()) {
      fetchWeatherData(searchTerm);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h1>Weather Forecast App</h1>
        <p className="app-description">
          Get real-time weather data and forecasts for any city around the world
        </p>
        
        <SearchBar onSearch={handleSearch} />
        
        {loading && (
          <div className="loader">
            <div className="loader-spinner"></div>
            <p>Loading weather data...</p>
          </div>
        )}
        
        {error && <div className="error-message">{error}</div>}
        
        {weatherData && (
          <div className="weather-container">
            <WeatherCard 
              weatherData={weatherData} 
              isFavorite={favorites.includes(weatherData.name)}
              onAddFavorite={() => addToFavorites(weatherData.name)}
              onRemoveFavorite={() => removeFromFavorites(weatherData.name)}
            />
            
            {forecastData && <Forecast forecastData={forecastData} />}
          </div>
        )}
        
        <FavoriteCities 
          favorites={favorites} 
          onSelectCity={fetchWeatherData}
          onRemoveCity={removeFromFavorites}
        />
        
        {!weatherData && !loading && defaultCities.length > 0 && (
          <div className="default-cities">
            <h3>Popular Cities</h3>
            <div className="default-cities-grid">
              {defaultCities.map(city => (
                <button 
                  key={city} 
                  className="default-city-button"
                  onClick={() => fetchWeatherData(city)}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <footer className="app-footer">
        <p>Powered by OpenWeather API | Created with React & Node.js</p>
      </footer>
    </div>
  );
}

export default App;



const fetchWeatherData = async (city) => {
  setLoading(true);
  setError(null);
  
  try {
    
    const weatherResponse = await fetch(`/api/weather/${city}`);
    
    if (!weatherResponse.ok) {
      const errorData = await weatherResponse.json();
      throw new Error(errorData.message || 'Failed to fetch weather data');
    }
    
    const weatherResult = await weatherResponse.json();
    setWeatherData(weatherResult);
    
   
    const forecastResponse = await fetch(`/api/forecast/${city}`);
    
    if (!forecastResponse.ok) {
      throw new Error('Failed to fetch forecast data');
    }
    
    const forecastResult = await forecastResponse.json();
    setForecastData(forecastResult);
    
  } catch (err) {
    setError(err.message);
    console.error('Error fetching data:', err);
  } finally {
    setLoading(false);
  }
};