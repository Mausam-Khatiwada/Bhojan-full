import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = ({ setShowLogin }) => {
  return (
    <header className="header" id="home">
      <div className="header-overlay"></div>
      <div className="header-container">
        <div className="header-contents">
          <h1>Order Your Favorite Food With Ease</h1>
          <p className="header-description">
            Discover a world of flavors with our carefully crafted menu. 
            From sizzling appetizers to decadent desserts, we bring 
            restaurant-quality meals straight to your doorstep in minutes.
          </p>
          <div className="header-actions">
            <a href="#explore-menu" className="primary-btn">
              Explore Menu
            </a>
            <button 
              className="secondary-btn"
              onClick={() => setShowLogin(true)}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;