import React, { useContext, useEffect, useState } from 'react'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { assets } from '../../assets/assets'
import { FiPackage, FiClock, FiCheckCircle, FiTruck, FiXCircle } from 'react-icons/fi'
import './MyOrders.css'

const MyOrders = () => {
    const { url, token } = useContext(StoreContext)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchOrders = async () => {
        try {
            const response = await axios.post(url + "/api/order/userOrders", {}, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setData(response.data.data)
        } catch (error) {
            console.error("Failed to fetch orders:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (token) {
            fetchOrders()
        }
    }, [token])

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return <FiClock className="icon pending" />
            case 'processing':
                return <FiPackage className="icon processing" />
            case 'shipped':
            case 'out_for_delivery':
                return <FiTruck className="icon shipped" />
            case 'delivered':
                return <FiCheckCircle className="icon delivered" />
            case 'cancelled':
                return <FiXCircle className="icon cancelled" />
            default:
                return <FiPackage className="icon default" />
        }
    }

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' }
        return new Date(dateString).toLocaleDateString(undefined, options)
    }

    return (
        <div className='my-orders'>
            <div className="headers">
                <h2><FiPackage /> My Orders</h2>
                <p>View your order history and track current orders</p>
            </div>

            {loading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading your orders...</p>
                </div>
            ) : data.length === 0 ? (
                <div className="no-orders">
                    <img src={assets.empty_order} alt="No orders" />
                    <h3>No Orders Found</h3>
                    <p>You haven't placed any orders yet.</p>
                </div>
            ) : (
                <div className="orders-container">
                    {data.map((order, index) => (
                        <div key={order._id || index} className="order-card">
                            <div className="order-header">
                                <div className="order-id">Order #{order._id.substring(0, 8)}</div>
                                <div className="order-date">{formatDate(order.date)}</div>
                            </div>

                            <div className="order-body">
                                <div className="order-items">
                                    <h4>Items:</h4>
                                    <ul>
                                        {order.items.map((item, idx) => (
                                            <li key={idx}>
                                                {item.name} <span className="quantity">x{item.quantity}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="order-summary">
                                    <div className="summary-item">
                                        <span>Subtotal:</span>
                                        <span>Rs {order.amount}.00</span>
                                    </div>
                                    <div className="summary-item">
                                        <span>Items:</span>
                                        <span>{order.items.length}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="order-footer">
                                <div className={`status ${order.status.toLowerCase()}`}>
                                    {getStatusIcon(order.status)}
                                    <span>{order.status}</span>
                                </div>
                                <button className="track-button">
                                    <FiTruck /> Track Order
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default MyOrders