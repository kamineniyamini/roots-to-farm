import React from 'react'
import { Link } from 'react-router-dom'
import { FaLeaf, FaTruck, FaUsers, FaSeedling } from 'react-icons/fa'
import './Home.css'

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Fresh From Farm to Your Table</h1>
            <p>Experience the difference of locally sourced, farm-fresh produce delivered directly to your doorstep</p>
            <div className="hero-buttons">
              <Link to="/shop" className="btn btn-primary">Shop Now</Link>
              <Link to="/farmers" className="btn btn-secondary">Meet Our Farmers</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features section">
        <div className="container">
          <h2 className="section-title">Why Choose Roots to Farm?</h2>
          <div className="features-grid grid grid-3">
            <div className="feature-card card">
              <div className="feature-icon">
                <FaLeaf />
              </div>
              <h3>100% Fresh</h3>
              <p>Direct from local farms, harvested at peak freshness for maximum flavor and nutrition</p>
            </div>
            <div className="feature-card card">
              <div className="feature-icon">
                <FaTruck />
              </div>
              <h3>Fast Delivery</h3>
              <p>Quick and reliable delivery from farm to your table within 24 hours of harvest</p>
            </div>
            <div className="feature-card card">
              <div className="feature-icon">
                <FaUsers />
              </div>
              <h3>Support Local</h3>
              <p>Help local farmers grow their business and strengthen your community</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories section">
        <div className="container">
          <h2 className="section-title">Our Products</h2>
          <div className="categories-grid grid grid-4">
            <div className="category-card card">
              <div className="category-image">
                <img src="/images/fruits.jpg" alt="Fresh Fruits" />
              </div>
              <div className="category-content">
                <FaSeedling className="category-icon" />
                <h3>Fresh Fruits</h3>
                <p>Seasonal fruits from local orchards</p>
                <Link to="/shop?category=fruits" className="btn btn-secondary">Explore</Link>
              </div>
            </div>
            <div className="category-card card">
              <div className="category-image">
                <img src="/images/vegetables.jpg" alt="Fresh Vegetables" />
              </div>
              <div className="category-content">
                <FaSeedling className="category-icon" />
                <h3>Vegetables</h3>
                <p>Farm-fresh vegetables daily</p>
                <Link to="/shop?category=vegetables" className="btn btn-secondary">Explore</Link>
              </div>
            </div>
            <div className="category-card card">
              <div className="category-image">
                <img src="/images/dairy.jpg" alt="Dairy Products" />
              </div>
              <div className="category-content">
                <FaSeedling className="category-icon" />
                <h3>Dairy</h3>
                <p>Fresh milk, cheese & more</p>
                <Link to="/shop?category=dairy" className="btn btn-secondary">Explore</Link>
              </div>
            </div>
            <div className="category-card card">
              <div className="category-image">
                <img src="/images/seeds.jpg" alt="Seeds & Plants" />
              </div>
              <div className="category-content">
                <FaSeedling className="category-icon" />
                <h3>Seeds & Plants</h3>
                <p>For farmers and gardeners</p>
                <Link to="/shop?category=seeds" className="btn btn-secondary">Explore</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Experience Farm Fresh?</h2>
            <p>Join thousands of satisfied customers enjoying fresh produce</p>
            <div className="cta-buttons">
              <Link to="/shop" className="btn btn-accent">Start Shopping</Link>
              <Link to="/farmer-portal" className="btn btn-secondary">Sell Your Produce</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home