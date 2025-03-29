import React, { useState, useEffect } from 'react';
import './Order.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets } from '../../assets/assets';
import { FiCopy, FiExternalLink, FiSearch, FiFilter, FiCreditCard, FiPhone   } from 'react-icons/fi';

const Order = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [copiedId, setCopiedId] = useState(null);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error("Error fetching orders");
      }
    } catch (error) {
      toast.error("Failed to load orders");
      console.error("Error fetching orders:", error);
    }
  };

  const statusHandler = async (event, orderId) => {
    const selectElement = event.target;
    const originalStatus = selectElement.value;
    const newStatus = event.target.value;
  
    try {

  
      // Make API request
      const response = await axios.post(
        `${url}/api/order/status`,
        { orderId, status: newStatus },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          timeout: 10000
        }
      );
  
      if (!response.data.success) {
        throw new Error(response.data.message || "Status update failed");
      }
  
      // Success handling
      await fetchAllOrders();
      toast.success(`Status updated to ${newStatus} successfully!`, {
        autoClose: 3000,
        icon: '✅'
      });
  
    } catch (error) {
      // Error handling
      console.error("Status update error:", error);
      selectElement.value = originalStatus;
      
      toast.error(
        error.response?.data?.message || 
        error.message || 
        "Failed to update status",
        {
          autoClose: 4000,
          icon: '❌'
        }
      );
  
    } finally {
 
      selectElement.disabled = false;
    }
  };

  

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.transaction_uuid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.address?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.address?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.address?.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className='order-container'>
      <div className="order-header">
        <div>
          <h2 className="order-title">Order Management</h2>
          <p className="order-subtitle">Track and manage customer orders</p>
        </div>
        <div className="order-controls">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-dropdown">
            <FiFilter className="filter-icon" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="Food Processing">Processing</option>
              <option value="Out for delivery">In Transit</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        </div>
      </div>

      <div className="order-stats">
        <div className="stat-card">
          <h3>{orders.length}</h3>
          <p>Total Orders</p>
        </div>
        <div className="stat-card">
          <h3>{orders.filter(order => order.status === "Food Processing").length}</h3>
          <p>Processing</p>
        </div>
        <div className="stat-card">
          <h3>{orders.filter(order => order.status === "Out for delivery").length}</h3>
          <p>In Transit</p>
        </div>
        <div className="stat-card">
          <h3>{orders.filter(order => order.status === "Delivered").length}</h3>
          <p>Delivered</p>
        </div>
      </div>

      <div className="order-list">
        {filteredOrders.length === 0 ? (
          <div className="no-orders">
            <img src={assets.empty_order} alt="No orders" />
            <p>No orders match your search criteria</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-card-header">
                <div className="order-icon">
                  <img src={assets.parcel_icon} alt="Order" />
                  <span className="order-id">#{order._id?.slice(-6).toUpperCase()}</span>
                </div>
                <div className="order-meta">
                  <span className={`order-status ${order.status?.replace(/\s+/g, '-').toLowerCase()}`}>
                    {order.status || "Food Processing"}
                  </span>
                  <span className="order-date">
                    {new Date(order.date).toLocaleDateString()}
                  </span>
                  {order.transaction_uuid && (
                    <div className="transaction-id-container">
                      <span 
                        className="transaction-id"
                        onClick={() => copyToClipboard(order.transaction_uuid, order._id)}
                        title={order.transaction_uuid}
                      >
                        <FiCreditCard  />
                        {order.transaction_uuid.slice(0, 6)}...{order.transaction_uuid.slice(-4)}
                        <FiCopy className={`copy-icon ${copiedId === order._id ? 'copied' : ''}`} />
                      </span>
                      {order.payment_gateway && (
                        <a 
                          href={`https://dashboard.example.com/payments/${order.transaction_uuid}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="payment-link"
                          title="View in payment gateway"
                        >
                          <FiExternalLink />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="order-details">
                <div className="order-items">
                  <h4>Items:</h4>
                  <div className="items-list">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="item">
                        <span className="item-name">{item.name}</span>
                        <span className="item-quantity">x{item.quantity}</span>
                        <span className="item-price">Rs {item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="order-customer">
                  <h4>Customer:</h4>
                  <p className="customer-name">
                    {order.address?.firstName} {order.address?.lastName}
                  </p>
                  <p className="customer-phone">
                    <FiPhone  />
                    {order.address?.phone}
                  </p>
                  <div className="customer-address">
                    <p>{order.address?.street},</p>
                    <p>{order.address?.city}, {order.address?.province}</p>
                    <p>{order.address?.zipcode}</p>
                  </div>
                </div>
              </div>

              <div className="order-footer">
                <div className="order-total">
                  <span>Total:</span>
                  <span className="total-amount">Rs {order.amount}</span>
                </div>
                
                <select 
                  className="status-select"
                  value={order.status || "Food Processing"}
                  onChange={(event) => statusHandler(event, order.orderId)}
                >
                  <option value="Food Processing">Processing</option>
                  <option value="Out for delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Order;