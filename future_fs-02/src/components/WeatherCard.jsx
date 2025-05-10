import React from 'react';

function WeatherCard({ data }) {
  const { name, main, weather, sys, wind } = data;
  
  
  const date = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  
  const celsiusTemp = Math.round(main.temp - 273.15);
  const fahrenheitTemp = Math.round((main.temp - 273.15) * 9/5 + 32);
  
  return (
    <div className="weather-card">
      <div className="weather-header">
        <h2>{name}, {sys.country}</h2>
        <p className="date">{date}</p>
      </div>
      
      <div className="weather-info">
        <div className="weather-icon">
          <img 
            src={`http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`} 
            alt={weather[0].description} 
          />
        </div>
        
        <div className="temperature">
          <h1>{celsiusTemp}°C / {fahrenheitTemp}°F</h1>
          <p className="weather-description">{weather[0].description}</p>
        </div>
      </div>
      
      <div className="weather-details">
        <div className="detail">
          <span className="label">Feels Like</span>
          <span className="value">{Math.round(main.feels_like - 273.15)}°C</span>
        </div>
        <div className="detail">
          <span className="label">Humidity</span>
          <span className="value">{main.humidity}%</span>
        </div>
        <div className="detail">
          <span className="label">Wind</span>
          <span className="value">{wind.speed} m/s</span>
        </div>
        <div className="detail">
          <span className="label">Pressure</span>
          <span className="value">{main.pressure} hPa</span>
        </div>
      </div>
    </div>
  );
}
