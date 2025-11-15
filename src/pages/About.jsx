import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-split-container">
      <div className="about-left">
        <div className="intro-header">
          <p className="intro-label">📁 Mystora ARCHIVE FILE — CLASSIFIED</p>
        </div>

        <h1>Welcome, Investigator.</h1>
        <p className="tagline">You’ve accessed the internal dossier of the Mystora Agency.</p>

        <section>
          <h2>Who We Are</h2>
          <p>
            <strong>Mystora</strong> is an independent creative studio specializing in
            printable mystery games, crime case files, and narrative-driven escape room experiences.
            We combine storytelling, puzzle design, and cinematic world-building to create
            immersive adventures you can play anywhere.
          </p>

          <h2>What We Create</h2>
          <ul>
            <li>
              <strong>🕵️ Crime & Detective Mysteries:</strong> Analyze crime scenes, examine evidence, and
              uncover hidden motives through realistic case files.
            </li>
            <li>
              <strong>🔐 Escape Room Challenges:</strong> Layered puzzles, timed missions, and
              narrative clues that pull you deeper into each story.
            </li>
            <li>
              <strong>📚 Story-Rich Printables:</strong> Designed to be both entertaining and cinematic,
              perfect for solo players, couples, groups, and classrooms.
            </li>
          </ul>

          <h2>Our Approach</h2>
          <p>
            Every Mystora game is designed with the philosophy that mysteries should feel
            personal. We focus on atmosphere, emotion, and the small details that make a case
            come alive. Nothing is random — everything is a clue.
          </p>

          <h2>Our Origin Story</h2>
          <p>
            Established in <strong>2025</strong>, Mystora began as a passion project and
            quickly grew into a dedicated creative brand committed to crafting premium,
            story-driven mystery games for a global audience.
          </p>

          <h2>Contact & Access</h2>
          <ul className="contact-info">
            <li>
              <strong>📧 Email:</strong>{' '}
              <a href="mailto:mystoragames@gmail.com">mystoragames@gmail.com</a>
            </li>
            <li>
              <strong>🛒 Etsy Archive:</strong>{' '}
              <a
                href="https://Mystoragames.etsy.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Mystora.etsy.com
              </a>
            </li>
          </ul>

          <h2>Our Mission</h2>
          <p>
            Mystora exists to turn storytelling into an experience. When you open a Mystora
            case, you’re not just playing a game — you’re stepping into a living world filled
            with secrets, motives, and unforgettable revelations.
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;
