import React from "react";
import "./ExploreMenu.css";
import { menu_list } from "../../assets/assets";

const ExploreMenu = ({ category, setCategory }) => {
  return (
    <div className="explore-menu" id="explore-menu">
      <div className="explore-menu-container">
        <div className="explore-menu-header">
          <h1 className="explore-menu-title">Explore Our Menu</h1>
          <p className="explore-menu-text">
            Discover our diverse selection of mouth-watering dishes crafted to 
            satisfy every palate. From classic favorites to innovative creations, 
            each bite is a celebration of flavor.
          </p>
        </div>
        
        <div className="explore-menu-list">
          {menu_list.map((item, index) => (
            <div
              onClick={() => setCategory(prev => prev === item.menu_name ? "All" : item.menu_name)}
              key={index}
              className={`explore-menu-list-item ${category === item.menu_name ? "active" : ""}`}
              aria-label={`Select ${item.menu_name} category`}
            >
              <div className="menu-image-container">
                <img
                  src={item.menu_image}
                  alt={item.menu_name}
                  loading="lazy"
                  className="menu-item-image"
                />
                {category === item.menu_name && (
                  <div className="active-indicator"></div>
                )}
              </div>
              <p className="menu-item-name">{item.menu_name}</p>
            </div>
          ))}
        </div>
        
        <div className="menu-divider">
          <div className="divider-line"></div>
          <div className="divider-icon">✻</div>
          <div className="divider-line"></div>
        </div>
      </div>
    </div>
  );
};

export default ExploreMenu;