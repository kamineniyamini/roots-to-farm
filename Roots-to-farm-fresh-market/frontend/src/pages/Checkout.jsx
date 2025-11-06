import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { ordersAPI } from '../services/api'
import { FaCreditCard, FaMoneyBill, FaUniversity, FaQrcode } from 'react-icons/fa'
import './Checkout.css'

const Checkout = () => {
  const { cart, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India'
    },
    paymentMethod: 'upi'
  })

  useEffect(() => {
    if (!cart || cart.items.length === 0) {
      navigate('/cart')
    }

    // Pre-fill address if available
    if (user?.address) {
      setFormData(prev => ({
        ...prev,
        shippingAddress: { ...prev.shippingAddress, ...user.address }
      }))
    }
  }, [cart, user, navigate])

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const orderData = {
        shippingAddress: formData.shippingAddress,
        paymentMethod: formData.paymentMethod
      }

      const response = await ordersAPI.create(orderData)
      
      if (response.data.success) {
        await clearCart()
        navigate('/orders', { 
          state: { 
            message: 'Order placed successfully!',
            orderId: response.data.order._id
          }
        })
      }
    } catch (error) {
      console.error('Order creation error:', error)
      alert(error.response?.data?.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  if (!cart || cart.items.length === 0) {
    return null
  }

  const subtotal = cart.totalAmount || 0
  const tax = subtotal * 0.1
  const total = subtotal + tax

  const paymentMethods = [
    { value: 'upi', label: 'UPI Payment', icon: <FaQrcode /> },
    { value: 'card', label: 'Credit/Debit Card', icon: <FaCreditCard /> },
    { value: 'bank_transfer', label: 'Bank Transfer', icon: <FaUniversity /> },
    { value: 'cash', label: 'Cash on Delivery', icon: <FaMoneyBill /> }
  ]

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Checkout</h1>

        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="checkout-content">
            <div className="checkout-sections">
              {/* Shipping Address */}
              <section className="checkout-section">
                <h2>Shipping Address</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Street Address</label>
                    <input
                      type="text"
                      value={formData.shippingAddress.street}
                      onChange={(e) => handleInputChange('shippingAddress', 'street', e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      value={formData.shippingAddress.city}
                      onChange={(e) => handleInputChange('shippingAddress', 'city', e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      value={formData.shippingAddress.state}
                      onChange={(e) => handleInputChange('shippingAddress', 'state', e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>ZIP Code</label>
                    <input
                      type="text"
                      value={formData.shippingAddress.zipCode}
                      onChange={(e) => handleInputChange('shippingAddress', 'zipCode', e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Country</label>
                    <input
                      type="text"
                      value={formData.shippingAddress.country}
                      onChange={(e) => handleInputChange('shippingAddress', 'country', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </section>

              {/* Payment Method */}
              <section className="checkout-section">
                <h2>Payment Method</h2>
                <div className="payment-methods">
                  {paymentMethods.map(method => (
                    <label key={method.value} className="payment-method">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={formData.paymentMethod === method.value}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          paymentMethod: e.target.value
                        }))}
                      />
                      <div className="payment-method-content">
                        <span className="payment-icon">{method.icon}</span>
                        <span className="payment-label">{method.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </section>

              {/* Order Items */}
              <section className="checkout-section">
                <h2>Order Items</h2>
                <div className="order-items">
                  {cart.items.map(item => (
                    <div key={item._id} className="order-item">
                      <img 
                        src={item.product.images?.[0] || '/placeholder-image.jpg'} 
                        alt={item.product.name}
                      />
                      <div className="item-info">
                        <h4>{item.product.name}</h4>
                        <p>Qty: {item.quantity}</p>
                      </div>
                      <div className="item-price">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Order Summary */}
            <div className="order-summary">
              <div className="summary-card">
                <h3>Order Summary</h3>
                
                <div className="summary-row">
                  <span>Subtotal ({cart.items.length} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                
                <div className="summary-row">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                
                <div className="summary-divider"></div>
                
                <div className="summary-row total">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary place-order-btn"
                  disabled={loading}
                >
                  {loading ? 'Placing Order...' : `Place Order - $${total.toFixed(2)}`}
                </button>

                <p className="security-note">
                  🔒 Your payment information is secure and encrypted
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Checkout