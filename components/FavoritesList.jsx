import React from 'react';

function FavoritesList({ favorites, onSelect, onRemove }) {
  if (favorites.length === 0) {
    return (
      <div className="favorites-container">
        <h3>Favorite Cities</h3>
        <p className="no-favorites">No favorite cities yet</p>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <h3>Favorite Cities</h3>
      <ul className="favorites-list">
        {favorites.map((city) => (
          <li key={city.id} className="favorite-item">
            <span onClick={() => onSelect(city.name)} className="favorite-name">
              {city.name}, {city.country}
            </span>
            <button 
              className="remove-button"
              onClick={() => onRemove(city.name)}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FavoritesList;