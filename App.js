import React, { useState, useEffect } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import FavoritesList from './components/FavoritesList';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify';

function App() {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [favorites, setFavorites] = useState(() => {
      const saved = localStorage.getItem('favorites');
      return saved ? JSON.parse(saved) : [];
    });
  
    useEffect(() => {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);
  
    const searchWeather = async (city) => {
      if (!city.trim()) {
        toast.error('Please enter a city name');
        return;
      }
  
      setLoading(true);
      try {
        const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
        const data = await response.json();
        
        if (data.error) {
          toast.error(data.error);
          setWeatherData(null);
        } else {
          setWeatherData(data);
        }
      } catch (error) {
        toast.error('Failed to fetch weather data');
        console.error('Error fetching weather:', error);
      } finally {
        setLoading(false);
      }
    };
  
    const addToFavorites = () => {
      if (!weatherData) return;
      
      const city = weatherData.name;
      if (favorites.some(fav => fav.name === city)) {
        toast.info('City already in favorites');
        return;
      }
      
      const newFavorite = {
        name: city,
        country: weatherData.sys.country,
        id: weatherData.id
      };
      
      setFavorites(prev => [...prev, newFavorite]);
      toast.success(`${city} added to favorites`);
    };
  
    const removeFromFavorites = (cityName) => {
      setFavorites(prev => prev.filter(city => city.name !== cityName));
      toast.info(`${cityName} removed from favorites`);
    };
  
    const loadFavoriteWeather = (cityName) => {
      searchWeather(cityName);
    };
  
    return (
      <div className="app-container">
        <div className="weather-app">
          <h1>Weather Forecast</h1>
          <SearchBar onSearch={searchWeather} />
          
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Fetching weather data...</p>
            </div>
          ) : weatherData ? (
            <div className="weather-container">
              <WeatherCard data={weatherData} />
              <button 
                className="favorite-button"
                onClick={addToFavorites}
              >
                Add to Favorites
              </button>
            </div>
          ) : (
            <div className="empty-state">
              <p>Search for a city to see the weather forecast</p>
            </div>
          )}
          
          <FavoritesList 
            favorites={favorites} 
            onSelect={loadFavoriteWeather} 
            onRemove={removeFromFavorites} 
          />
        </div>
        <ToastContainer position="bottom-right" autoClose={3000} />
      </div>
    );
  }
  
  export default App;
  
  // components/SearchBar.js
  import React, { useState } from 'react';
  
  function SearchBar({ onSearch }) {
    const [city, setCity] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSearch(city);
    };
  
    return (
      <form className="search-bar" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
    );
  }
  