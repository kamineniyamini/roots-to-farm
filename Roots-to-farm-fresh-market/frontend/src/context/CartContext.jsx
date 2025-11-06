import React, { createContext, useState, useContext, useEffect } from 'react'
import { cartAPI } from '../services/api'
import { useAuth } from './AuthContext'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(false)
  
  // Safely get auth context - handle case where it might not be available yet
  let isAuthenticated = false
  try {
    const auth = useAuth()
    isAuthenticated = auth.isAuthenticated
  } catch (error) {
    // Auth context not available yet, will be handled by useEffect
    console.log('Auth context not available yet, will retry...')
  }

  useEffect(() => {
    // Only fetch cart if authenticated
    if (isAuthenticated) {
      fetchCart()
    } else {
      setCart(null)
    }
  }, [isAuthenticated])

  const fetchCart = async () => {
    try {
      setLoading(true)
      const response = await cartAPI.get()
      setCart(response.data.cart)
    } catch (error) {
      console.error('Error fetching cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      return { success: false, message: 'Please login to add items to cart' }
    }

    try {
      const response = await cartAPI.addItem({ productId, quantity })
      setCart(response.data.cart)
      return { success: true }
    } catch (error) {
      const message = error.message || 'Failed to add item to cart'
      return { success: false, message }
    }
  }

  const updateCartItem = async (itemId, quantity) => {
    try {
      const response = await cartAPI.updateItem(itemId, quantity)
      setCart(response.data.cart)
      return { success: true }
    } catch (error) {
      const message = error.message || 'Failed to update cart item'
      return { success: false, message }
    }
  }

  const removeFromCart = async (itemId) => {
    try {
      const response = await cartAPI.removeItem(itemId)
      setCart(response.data.cart)
      return { success: true }
    } catch (error) {
      const message = error.message || 'Failed to remove item from cart'
      return { success: false, message }
    }
  }

  const clearCart = async () => {
    try {
      await cartAPI.clear()
      setCart(null)
      return { success: true }
    } catch (error) {
      const message = error.message || 'Failed to clear cart'
      return { success: false, message }
    }
  }

  const getCartCount = () => {
    if (!cart || !cart.items) return 0
    return cart.items.reduce((total, item) => total + item.quantity, 0)
  }

  const getCartTotal = () => {
    if (!cart) return 0
    return cart.totalAmount || 0
  }

  const value = {
    cart,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    fetchCart,
    getCartCount,
    getCartTotal
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}