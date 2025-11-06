import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ordersAPI } from '../services/api'
import { FaBox, FaShippingFast, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa'
import './Orders.css'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    fetchOrders()
    
    // Show success message if redirected from checkout
    if (location.state?.message) {
      alert(location.state.message)
    }
  }, [location])

  const fetchOrders = async () => {
    try {
      const response = await ordersAPI.getMyOrders()
      setOrders(response.data.orders)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FaClock className="status-icon pending" />
      case 'confirmed':
        return <FaBox className="status-icon confirmed" />
      case 'processing':
        return <FaBox className="status-icon processing" />
      case 'shipped':
        return <FaShippingFast className="status-icon shipped" />
      case 'delivered':
        return <FaCheckCircle className="status-icon delivered" />
      case 'cancelled':
        return <FaTimesCircle className="status-icon cancelled" />
      default:
        return <FaClock className="status-icon pending" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#ff9800'
      case 'confirmed':
        return '#2196f3'
      case 'processing':
        return '#2196f3'
      case 'shipped':
        return '#673ab7'
      case 'delivered':
        return '#4caf50'
      case 'cancelled':
        return '#f44336'
      default:
        return '#666'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="orders-page">
        <div className="container">
          <div className="loading">Loading orders...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="orders-page">
      <div className="container">
        <div className="orders-header">
          <h1>My Orders</h1>
          <p>Track your farm fresh deliveries</p>
        </div>

        {orders.length === 0 ? (
          <div className="empty-orders">
            <FaBox className="empty-icon" />
            <h2>No orders yet</h2>
            <p>Start shopping for fresh farm products</p>
            <Link to="/shop" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order._id.slice(-8).toUpperCase()}</h3>
                    <p className="order-date">Placed on {formatDate(order.createdAt)}</p>
                  </div>
                  <div className="order-status">
                    {getStatusIcon(order.orderStatus)}
                    <span style={{ color: getStatusColor(order.orderStatus) }}>
                      {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="order-items-preview">
                  {order.items.slice(0, 3).map((item, index) => (
                    <div key={index} className="preview-item">
                      <img 
                        src={item.product?.images?.[0] || '/placeholder-image.jpg'} 
                        alt={item.name}
                      />
                      <span className="item-name">{item.name}</span>
                      <span className="item-quantity">Qty: {item.quantity}</span>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="more-items">
                      +{order.items.length - 3} more items
                    </div>
                  )}
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    Total: <strong>${order.totalAmount?.toFixed(2)}</strong>
                  </div>
                  <div className="order-actions">
                    <Link 
                      to={`/orders/${order._id}`} 
                      className="btn btn-outline"
                    >
                      View Details
                    </Link>
                    {order.orderStatus === 'pending' && (
                      <button className="btn btn-outline cancel-btn">
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders