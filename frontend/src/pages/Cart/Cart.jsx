import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { FiTrash2, FiArrowLeft } from "react-icons/fi";
import { assets } from "../../assets/assets";

const Cart = () => {
  const { cartItem, food_list, removeFromCart, getTotalCartAmount, url } = useContext(StoreContext);
  const navigate = useNavigate();

  return (
    <div className="cart-page">
      <Navbar hideMenuLink={true} />
      <div className="cart-content">
        <div className="cart-container">
          <button className="back-button" onClick={() => navigate(-1)}>
            <FiArrowLeft size={20} />
            Continue Shopping
          </button>
          
          <h1 className="cart-title">Your Cart</h1>
          
          {getTotalCartAmount() === 0 ? (
            <div className="empty-cart">
              <img src={assets.empty_cart} alt="Empty cart" className="empty-cart-image" />
              <h2>Your cart is empty</h2>
              <p>Looks like you haven't added anything to your cart yet</p>
              <button className="btn-primary" onClick={() => navigate('/')}>
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="cart">
              <div className="cart-items">
                <div className="cart-items-header">
                  <div className="header-product">Product</div>
                  <div className="header-price">Price</div>
                  <div className="header-quantity">Quantity</div>
                  <div className="header-total">Total</div>
                  <div className="header-remove"></div>
                </div>
                
                <div className="cart-items-list">
                  {food_list.map((item, index) => {
                    if (cartItem[item._id] > 0) {
                      return (
                        <div className="cart-item" key={item._id || index}>
                          <div className="cart-item-product">
                            <img 
                              src={url + "/images/" + item.image} 
                              alt={item.name} 
                              className="cart-item-image"
                              loading="lazy"
                            />
                            <div className="cart-item-name">{item.name}</div>
                          </div>
                          <div className="cart-item-price">Rs {item.price}</div>
                          <div className="cart-item-quantity">{cartItem[item._id]}</div>
                          <div className="cart-item-total">Rs {item.price * cartItem[item._id]}</div>
                          <button 
                            className="cart-item-remove" 
                            onClick={() => removeFromCart(item._id)}
                            aria-label={`Remove ${item.name} from cart`}
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
              
              <div className="cart-summary">
                <div className="cart-total">
                  <h3>Order Summary</h3>
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>Rs {getTotalCartAmount()}</span>
                  </div>
                  <div className="summary-row">
                    <span>Delivery Fee</span>
                    <span>Rs {getTotalCartAmount() === 0 ? 0 : 115}</span>
                  </div>
                  <div className="summary-divider"></div>
                  <div className="summary-row total">
                    <span>Total</span>
                    <span>Rs {getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 115}</span>
                  </div>
                  
                  <button 
                    className="checkout-button" 
                    onClick={() => navigate('/order')}
                  >
                    Proceed to Checkout
                  </button>
                </div>
                
                <div className="cart-promo">
                  <h4>Have a Promo Code?</h4>
                  <div className="promo-input-group">
                    <input 
                      type="text" 
                      placeholder="Enter promo code" 
                      className="promo-input"
                    />
                    <button className="promo-button">Apply</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;