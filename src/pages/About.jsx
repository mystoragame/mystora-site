import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-split-container">
      <div className="about-left">
        <div className="intro-header">
          <p className="intro-label">📁 MYNTORA DOSYA NO.001 – CLASSIFIED</p>
        </div>

        <h1>Welcome, Investigator.</h1>
        <p className="tagline">You're about to uncover who we are behind the case files.</p>

        <section>
          <h2>Agency Profile</h2>
          <p><strong>Myntora</strong> is not just a game studio — we’re a narrative bureau. We design printable escape room games and detective mysteries that blend storytelling, logic, and emotion.</p>

          <h2>Case Formats We Deploy</h2>
          <ul>
            <li><strong>🕵️ Detective Mystery Games:</strong> Reconstruct crime scenes, analyze suspect files, and piece together motives.</li>
            <li><strong>🔐 Escape Room Scenarios:</strong> Timed challenges, layered puzzles, and narrative-driven breakthroughs.</li>
          </ul>

          <h2>Signature Methods</h2>
          <p>Every Myntora game is handcrafted like a real case file. We choose emotion over noise, subtlety over spectacle. If you're looking for meaning, you’re in the right archive.</p>

          <h2>Chronicle</h2>
          <p>Established in <strong>May 2025</strong> by <strong>Morgan Thorne</strong>, Myntora started as a secret project and evolved into a platform for immersive, story-rich investigations.</p>

          <h2>Field Office</h2>
          <ul className="contact-info">
            <li><strong>📍 HQ:</strong> New York, United States</li>
            <li><strong>📧 Contact:</strong> <a href="mailto:morgan@myntora.com">morgan@myntora.com</a></li>
            <li><strong>🛒 Archive Access:</strong> <a href="https://myntora.etsy.com" target="_blank" rel="noopener noreferrer">myntora.etsy.com</a></li>
          </ul>

          <h2>Why This File Exists</h2>
          <p>This is not just play. This is immersion, intellect, and intuition. You don’t just open a Myntora case — you become a part of it. And when it’s over, it stays with you.</p>
        </section>
      </div>
    </div>
  );
};

export default About;
