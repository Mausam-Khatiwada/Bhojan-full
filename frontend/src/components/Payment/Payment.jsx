import React from 'react';
import CryptoJS from "crypto-js";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiArrowLeft, FiLock, FiCreditCard, FiTruck } from "react-icons/fi";
import './Payment.css';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderData, setOrderData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (location.state && location.state.orderData) {
      setOrderData(location.state.orderData);
    } else {
      navigate('/cart');
    }
  }, [location.state, navigate]);

  if (!orderData) {
    return (
      <div className="payment-loading">
        <div className="loading-spinner"></div>
        <p>Loading payment details...</p>
      </div>
    );
  }

  const message = `total_amount=${orderData.total_amount},transaction_uuid=${orderData.transaction_uuid},product_code=EPAYTEST`;
  const hash = CryptoJS.HmacSHA256(message, "8gBm/:&EnhH.1/q");
  const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);

  const handleSubmit = (e) => {
    setIsProcessing(true);
    // You might want to add any pre-submit logic here
  };

  return (
    <div className="payment-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        <FiArrowLeft size={18} />
        Back to Order
      </button>

      <div className="payment-header">
        <h1>Complete Your Payment</h1>
        <p>Securely pay for your order using eSewa</p>
      </div>

      <div className="payment-grid">
        <div className="payment-summary">
          <div className="summary-card">
            <h2><FiCreditCard /> Order Summary</h2>
            
            <div className="summary-item">
              <span>Subtotal</span>
              <span>Rs {orderData.amount}</span>
            </div>
            
            <div className="summary-item">
              <span><FiTruck /> Delivery Fee</span>
              <span>Rs {orderData.product_delivery_charge}</span>
            </div>
            
            <div className="divider"></div>
            
            <div className="summary-item total">
              <span>Total Amount</span>
              <span>Rs {orderData.total_amount}</span>
            </div>
          </div>

          <div className="payment-security">
            <FiLock size={24} />
            <div>
              <h3>Secure Payment</h3>
              <p>Your payment information is processed securely. We do not store your card details.</p>
            </div>
          </div>
        </div>

        <div className="payment-form-container">
          <form
            action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
            method="POST"
            className="payment-form"
            onSubmit={handleSubmit}
          >
            <h2> Payment Details</h2>
            
            <div className="form-group">
              <label htmlFor="amount">Subtotal Amount</label>
              <div className="input-group">
                <span>Rs</span>
                <input
                  type="text"
                  id="amount"
                  name="amount"
                  value={orderData.amount}
                  readOnly
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="product_delivery_charge">Delivery Charge</label>
              <div className="input-group">
                <span>Rs</span>
                <input
                  type="text"
                  id="product_delivery_charge"
                  name="product_delivery_charge"
                  value={orderData.product_delivery_charge}
                  readOnly
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="total_amount">Total Amount</label>
              <div className="input-group">
                <span>Rs</span>
                <input
                  type="text"
                  id="total_amount"
                  name="total_amount"
                  value={orderData.total_amount}
                  readOnly
                />
              </div>
            </div>

            {/* Hidden fields */}
            <input type="hidden" id="tax_amount" name="tax_amount" value="0" />
            <input type="hidden" id="transaction_uuid" name="transaction_uuid" value={orderData.transaction_uuid} />
            <input type="hidden" id="product_code" name="product_code" value="EPAYTEST" />
            <input type="hidden" id="product_service_charge" name="product_service_charge" value="0" />
            <input type="hidden" id="success_url" name="success_url" value={`${window.location.origin}/success`} />
            <input type="hidden" id="failure_url" name="failure_url" value={`${window.location.origin}/failure`} />
            <input type="hidden" id="signed_field_names" name="signed_field_names" value="total_amount,transaction_uuid,product_code" />
            <input type="hidden" id="signature" name="signature" value={hashInBase64} />

            <button type="submit" className="submit-button" disabled={isProcessing}>
              {isProcessing ? 'Processing...' : 'Proceed to eSewa Payment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payment;