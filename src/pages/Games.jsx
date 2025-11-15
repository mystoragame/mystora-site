import React, { useEffect, useState } from 'react';
import GameCard from '../components/GameCard';
import './Games.css';

const Games = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch(`${process.env.PUBLIC_URL}/data/games.json`);
        const data = await response.json();
        setGames(data);
      } catch (error) {
        console.error('Veri alınamadı:', error);
      }
    };

    fetchGames();
  }, []);

  return (
    <div className="games-wrapper">
      <div className="games-header">
        <p className="games-label">📁 CASE ARCHIVE – ACCESS LEVEL: PUBLIC</p>
        <h1 className="games-title">Myntora Game Files</h1>
        <p className="games-tagline">Uncover puzzles. Solve mysteries. One file at a time.</p>
      </div>

      <div className="games-grid">
        {games.map((game, index) => (
          <GameCard
            key={index}
            title={game.title}
            description={game.description}
            imageUrl={game.imageUrl}
            etsyLink={game.etsyLink}
          />
        ))}
      </div>
    </div>
  );
};

export default Games;
