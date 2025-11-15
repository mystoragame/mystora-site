import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-content">
        <p className="home-label">MYNTORA FILE SYSTEM</p>
        <h1 className="home-title">Welcome, Investigator.</h1>
        <p className="home-tagline">Enter a world of cryptic puzzles and narrative mysteries.</p>

        <div className="home-buttons">
          <Link to="/games" className="home-btn">🔍 Explore Games</Link>
          <Link to="/solutions" className="home-btn">🗝️ Submit a Solution</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
