import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import "./PlaceOrder.css";
import { FiArrowLeft, FiCheckCircle } from "react-icons/fi";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const { getTotalCartAmount, token, food_list, cartItem, url, removeFromCart } = useContext(StoreContext);
  const delivery_fee = 115;

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    province: "",
    zipcode: "",
    phone: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prevData => ({ ...prevData, [name]: value }));
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const zipRegex = /^[0-9]{5}$/;

    if (Object.values(data).some(field => !field.trim())) {
      toast.error("Please fill in all fields before placing the order.");
      return false;
    }

    if (!emailRegex.test(data.email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }

    if (!phoneRegex.test(data.phone)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return false;
    }

    if (!zipRegex.test(data.zipcode)) {
      toast.error("Please enter a valid 5-digit zip code.");
      return false;
    }

    return true;
  };

  const createOrder = async (orderData) => {
    try {
      const response = await axios.post(`${url}/api/order/place`, orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.success ? response.data.orderId : null;
    } catch (error) {
      toast.error(`Error placing order: ${error.response?.data?.message || error.message}`);
      return null;
    }
  };

  const handleOrder = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const orderItems = food_list.filter(item => cartItem[item._id] > 0).map(item => ({
      ...item,
      quantity: cartItem[item._id]
    }));

    const orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount(),
      product_delivery_charge: delivery_fee,
      total_amount: getTotalCartAmount() + delivery_fee,
      transaction_uuid: uuidv4(),
    };

    const orderId = await createOrder(orderData);

    if (orderId) {
      toast.success("Order placed successfully! Redirecting to payment...", {
        icon: <FiCheckCircle size={24} />,
        autoClose: 2000,
        onClose: () => {
          if (typeof removeFromCart === "function") {
            removeFromCart();
          }
          navigate("/payment", { state: { orderData, orderId } });
        }
      });
    } else {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/cart');
    } else if (getTotalCartAmount() === 0) {
      navigate('/cart');
    }
  }, [token, getTotalCartAmount]);

  return (
    <div className="place-order-container">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <button className="back-button" onClick={() => navigate(-1)}>
        <FiArrowLeft size={18} />
        Back to Cart
      </button>

      <h1 className="page-title">Checkout</h1>
      
      <form onSubmit={handleOrder} className="place-order-form">
        <div className="place-order-grid">
          {/* Delivery Information Section */}
          <div className="delivery-section">
            <div className="section-header">
              <h2>Delivery Information</h2>
              <p>Please enter your details for order delivery</p>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={data.firstName}
                  onChange={onChangeHandler}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={data.lastName}
                  onChange={onChangeHandler}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={data.email}
                  onChange={onChangeHandler}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="street">Street Address</label>
                <input
                  id="street"
                  name="street"
                  type="text"
                  value={data.street}
                  onChange={onChangeHandler}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={data.city}
                  onChange={onChangeHandler}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="zipcode">Zip Code</label>
                <input
                  id="zipcode"
                  name="zipcode"
                  type="text"
                  value={data.zipcode}
                  onChange={onChangeHandler}
                  pattern="[0-9]{5}"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="province">Province</label>
                <select
                  id="province"
                  name="province"
                  value={data.province}
                  onChange={onChangeHandler}
                  required
                >
                  <option value="" disabled>Select Province</option>
                  <option value="Koshi Province">Koshi Province</option>
                  <option value="Madhesh Province">Madhesh Province</option>
                  <option value="Bagmati Province">Bagmati Province</option>
                  <option value="Gandaki Province">Gandaki Province</option>
                  <option value="Lumbini Province">Lumbini Province</option>
                  <option value="Karnali Province">Karnali Province</option>
                  <option value="Sudurpashchim Province">Sudurpashchim Province</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={data.phone}
                  onChange={onChangeHandler}
                  pattern="[0-9]{10}"
                  required
                />
              </div>
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="order-summary">
            <div className="section-header">
              <h2>Order Summary</h2>
              <p>Review your order before payment</p>
            </div>

            <div className="summary-card">
              <div className="summary-item">
                <span>Subtotal</span>
                <span>Rs {getTotalCartAmount()}</span>
              </div>
              
              <div className="summary-item">
                <span>Delivery Fee</span>
                <span>Rs {delivery_fee}</span>
              </div>
              
              <div className="divider"></div>
              
              <div className="summary-item total">
                <span>Total</span>
                <span>Rs {getTotalCartAmount() + delivery_fee}</span>
              </div>

              <button 
                type="submit" 
                className="payment-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
              </button>


            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PlaceOrder;