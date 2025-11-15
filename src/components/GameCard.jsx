import React from 'react';
import './GameCard.css';

const GameCard = ({ title, description, imageUrl, etsyLink }) => {
  return (
    <div className="game-card">
      <img src={imageUrl} alt={title} className="game-card-img" />
      <div className="game-card-content">
        <h3 className="game-card-title">{title}</h3>
        <p className="game-card-desc">{description}</p>
        <a href={etsyLink} target="_blank" rel="noopener noreferrer" className="game-card-button">
          Buy on Etsy
        </a>
      </div>
    </div>
  );
};

export default GameCard;
