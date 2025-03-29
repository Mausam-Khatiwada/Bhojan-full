import React, { useContext, useState } from 'react';
import './FoodItem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';

const FoodItem = ({ id, name, price, description, image }) => {
  const { cartItem, addToCart, removeFromCart, url } = useContext(StoreContext);
  const [hovered, setHovered] = useState(false);

  const handleHover = () => setHovered(true);
  const handleLeave = () => setHovered(false);

  return (
    <div className='food-item' onMouseEnter={handleHover} onMouseLeave={handleLeave}>
      <div className="food-item-image-container">
        <img className={`food-item-image ${hovered ? 'zoom' : ''}`} src={url + "/images/" + image} alt={name} />
        {!cartItem[id] ? (
          <img className='add' onClick={() => addToCart(id)} src={assets.add_icon_white} alt='Add to cart' />
        ) : (
          <div className='food-item-counter'>
            <img onClick={() => removeFromCart(id)} src={assets.remove_icon_red} alt="Remove" />
            <p>{cartItem[id]}</p>
            <img onClick={() => addToCart(id)} src={assets.add_icon_green} alt="Add" />
          </div>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="Rating" />
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">Rs {price}</p>
      </div>
    </div>
  );
};

export default FoodItem;
