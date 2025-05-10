
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');


const app = express();
const PORT = process.env.PORT || 5000;


const API_KEY = '1f5304f708242de2950285e4d6e9bbfd';


app.use(cors());
app.use(express.json());


app.use(express.static(path.join(__dirname, '../public')));


const defaultCities = [
  'New York',
  'London',
  'Tokyo',
  'Paris',
  'Sydney',
  'Dubai',
  'Mumbai',
  'Berlin',
  'Rio de Janeiro',
  'Toronto'
];


app.get('/api/default-cities', (req, res) => {
  res.json({ cities: defaultCities });
});


app.get('/api/weather/:city', async (req, res) => {
  try {
    const { city } = req.params;
    
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    
    
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: 'City not found. Please check the spelling and try again.' });
    }
    
    res.status(500).json({ message: 'Error fetching weather data. Please try again later.' });
  }
});


app.get('/api/forecast/:city', async (req, res) => {
  try {
    const { city } = req.params;
    
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching forecast data:', error.message);
    
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: 'City not found. Please check the spelling and try again.' });
    }
    
    res.status(500).json({ message: 'Error fetching forecast data. Please try again later.' });
  }
});


app.get('/api/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    
    
    const response = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
    );
    
    const cities = response.data.map(city => ({
      name: city.name,
      country: city.country,
      fullName: `${city.name}, ${city.country}`
    }));
    
    res.json({ cities });
  } catch (error) {
    console.error('Error searching cities:', error.message);
    res.status(500).json({ message: 'Error searching for cities' });
  }
});


app.get('/api/pollution/:lat/:lon', async (req, res) => {
  try {
    const { lat, lon } = req.params;
    
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching pollution data:', error.message);
    res.status(500).json({ message: 'Error fetching air pollution data' });
  }
});


app.get('/api/weather-details/:city', async (req, res) => {
  try {
    const { city } = req.params;
    
   
    const geoResponse = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
    );
    
    if (geoResponse.data.length === 0) {
      return res.status(404).json({ message: 'City not found' });
    }
    
    const { lat, lon } = geoResponse.data[0];
    
    
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=${API_KEY}&units=metric`
    );
    
    res.json(weatherResponse.data);
  } catch (error) {
    console.error('Error fetching detailed weather:', error.message);
    res.status(500).json({ message: 'Error fetching detailed weather information' });
  }
});


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});


const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};


module.exports = { startServer };


if (require.main === module) {
  startServer();
}