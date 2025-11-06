import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { FaShoppingCart, FaUser, FaLeaf, FaWarehouse, FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa'
import './Navbar.css'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, isAuthenticated } = useAuth()
  const { getCartCount } = useCart()

  const navItems = [
    { path: '/', label: 'Home', icon: <FaLeaf /> },
    { path: '/shop', label: 'Shop', icon: <FaShoppingCart /> },
    { path: '/farmers', label: 'Farmers', icon: <FaUser /> },
    { path: '/about', label: 'About', icon: <FaLeaf /> },
    { path: '/impact', label: 'Impact', icon: <FaLeaf /> },
    { path: '/contact', label: 'Contact', icon: <FaLeaf /> },
    { path: '/Dashboard', label: 'Dashboard', icon: <FaShoppingCart /> },
  ]

  // Add farmer portal if user is farmer
  if (user?.role === 'farmer') {
    navItems.push({ path: '/farmer-portal', label: 'Farmer Portal', icon: <FaUser /> })
  }

  // Add warehouse if user is admin
  if (user?.role === 'admin') {
    navItems.push({ path: '/warehouse', label: 'Warehouse', icon: <FaWarehouse /> })
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsMenuOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <div className="logo-wrapper">
            <img 
              src="/src/assets/logo.png" 
              alt="Roots to Farm Fresh Market" 
              className="logo-image"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'flex'
              }}
            />
            <div className="logo-fallback">
              <FaLeaf className="fallback-icon" />
            </div>
          </div>
          <span className="logo-text">Roots to Farm</span>
        </Link>

        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text">{item.label}</span>
            </Link>
          ))}

          {/* User Actions */}
          <div className="nav-actions">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/cart" 
                  className="nav-link cart-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="nav-icon">
                    <FaShoppingCart />
                    {getCartCount() > 0 && (
                      <span className="cart-badge">{getCartCount()}</span>
                    )}
                  </span>
                  <span className="nav-text">Cart</span>
                </Link>

                <Link 
                  to="/profile" 
                  className="nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="nav-icon">
                    <FaUser />
                  </span>
                  <span className="nav-text">Profile</span>
                </Link>

                <button 
                  className="nav-link logout-btn"
                  onClick={handleLogout}
                >
                  <span className="nav-icon">
                    <FaSignOutAlt />
                  </span>
                  <span className="nav-text">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="nav-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="nav-text">Login</span>
                </Link>
                <Link 
                  to="/register" 
                  className="nav-link btn btn-outline"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="nav-text">Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="nav-toggle" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>
    </nav>
  )
}

export default Navbar