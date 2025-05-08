// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app in production
app.use(express.static(path.join(__dirname, 'client/build')));

// Environment variables
const PORT = process.env.PORT || 5000;
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

// API endpoint for weather data
app.get('/api/weather', async (req, res) => {
  try {
    const { city } = req.query;
    
    if (!city) {
      return res.status(400).json({ error: 'City parameter is required' });
    }
    
    // Get current weather data
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}`
    );
    
    // Get forecast data
    const { lat, lon } = weatherResponse.data.coord;
    const forecastResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`
    );
    
    // Process forecast data to get daily forecasts
    const forecastData = processForecastData(forecastResponse.data.list);
    
    // Combine current weather and forecast data
    const weatherData = {
      ...weatherResponse.data,
      forecast: forecastData
    };
    
    res.json(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    
    // Check if it's an API error with a response
    if (error.response && error.response.data) {
      return res.status(error.response.status || 500).json({ 
        error: error.response.data.message || 'Failed to fetch weather data' 
      });
    }
    
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// Process forecast data to get daily forecasts (one per day)
function processForecastData(forecastList) {
  const dailyForecasts = {};
  
  forecastList.forEach(item => {
    const date = item.dt_txt.split(' ')[0]; // Extract date part
    
    // If we haven't stored a forecast for this date yet, or if this is mid-day (better representation)
    if (!dailyForecasts[date] || item.dt_txt.includes('12:00:00')) {
      dailyForecasts[date] = item;
    }
  });
  
  // Convert object to array and return only first 5 days
  return Object.values(dailyForecasts).slice(0, 5);
}

// Serve the React app for any other routes in production
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});