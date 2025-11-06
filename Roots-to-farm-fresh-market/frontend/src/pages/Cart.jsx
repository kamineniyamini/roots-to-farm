import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { FaTrash, FaPlus, FaMinus, FaShoppingBag, FaArrowLeft } from 'react-icons/fa'
import './Cart.css'

const Cart = () => {
  const { cart, updateCartItem, removeFromCart, clearCart, loading } = useCart()
  const [updatingItem, setUpdatingItem] = useState(null)
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="loading">Loading cart...</div>
        </div>
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <FaShoppingBag className="empty-icon" />
            <h2>Your cart is empty</h2>
            <p>Add some fresh products from our farm</p>
            <Link to="/shop" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return
    
    setUpdatingItem(itemId)
    await updateCartItem(itemId, newQuantity)
    setUpdatingItem(null)
  }

  const handleRemoveItem = async (itemId) => {
    await removeFromCart(itemId)
  }

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      await clearCart()
    }
  }

  const proceedToCheckout = () => {
    navigate('/checkout')
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <button 
            className="btn btn-outline clear-cart-btn"
            onClick={handleClearCart}
          >
            <FaTrash />
            Clear Cart
          </button>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {cart.items.map((item) => (
              <div key={item._id} className="cart-item">
                <div className="item-image">
                  <img 
                    src={item.product.images?.[0] || '/placeholder-image.jpg'} 
                    alt={item.product.name}
                    onError={(e) => {
                      e.target.src = '/placeholder-image.jpg'
                    }}
                  />
                </div>

                <div className="item-details">
                  <Link to={`/product/${item.product._id}`} className="item-name">
                    <h3>{item.product.name}</h3>
                  </Link>
                  <p className="farm-name">By {item.product.farmName}</p>
                  <p className="item-price">${item.price} each</p>
                  
                  {item.product.stock < item.quantity && (
                    <p className="stock-warning">
                      Only {item.product.stock} left in stock
                    </p>
                  )}
                </div>

                <div className="item-controls">
                  <div className="quantity-controls">
                    <button
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                      disabled={item.quantity <= 1 || updatingItem === item._id}
                    >
                      <FaMinus />
                    </button>
                    
                    <span className="quantity">
                      {updatingItem === item._id ? '...' : item.quantity}
                    </span>
                    
                    <button
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock || updatingItem === item._id}
                    >
                      <FaPlus />
                    </button>
                  </div>

                  <div className="item-total">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveItem(item._id)}
                    disabled={updatingItem === item._id}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>
              
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${cart.totalAmount?.toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              
              <div className="summary-row">
                <span>Tax</span>
                <span>${(cart.totalAmount * 0.1).toFixed(2)}</span>
              </div>
              
              <div className="summary-divider"></div>
              
              <div className="summary-row total">
                <span>Total</span>
                <span>${(cart.totalAmount * 1.1).toFixed(2)}</span>
              </div>

              <button 
                className="btn btn-primary checkout-btn"
                onClick={proceedToCheckout}
              >
                Proceed to Checkout
              </button>

              <Link to="/shop" className="continue-shopping">
                <FaArrowLeft />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart