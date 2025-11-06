import React from 'react'
import { Link } from 'react-router-dom'
import { FaLeaf, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <FaLeaf className="logo-icon" />
              <span>Roots to Farm</span>
            </div>
            <p className="footer-description">
              Connecting local farmers directly with consumers for fresh, sustainable produce. 
              Building a better food ecosystem for everyone.
            </p>
            <div className="social-links">
              <a href="#" className="social-link"><FaFacebook /></a>
              <a href="#" className="social-link"><FaTwitter /></a>
              <a href="#" className="social-link"><FaInstagram /></a>
              <a href="#" className="social-link"><FaLinkedin /></a>
            </div>
          </div>

          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/shop">Shop</Link></li>
              <li><Link to="/farmers">Farmers</Link></li>
              <li><Link to="/about">About Us</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Resources</h3>
            <ul className="footer-links">
              <li><Link to="/farmer-portal">Farmer Portal</Link></li>
              <li><Link to="/Dashboard">Dashboard</Link></li>
              <li><Link to="/impact">Our Impact</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Contact Info</h3>
            <div className="contact-info">
              <p>📧 info@rootstofarm.com</p>
              <p>📞 +1 (555) 123-ROOTS</p>
              <p>📍 123 Farm Fresh Lane, Agriculture City</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; @nomu_2024 Roots to Farm. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer