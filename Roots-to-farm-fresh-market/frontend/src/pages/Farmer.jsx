import React from 'react'
import { FaUser, FaMapMarkerAlt, FaStar, FaPhone, FaEnvelope } from 'react-icons/fa'
import './Farmer.css'

const Farmers = () => {
  const farmers = [
    {
      id: 1,
      name: 'Green Valley Farms',
      image: '/images/farmer1.jpg',
      location: 'California, USA',
      rating: 4.8,
      products: ['Organic Fruits', 'Fresh Vegetables'],
      description: 'Family-owned farm specializing in organic produce for over 20 years.',
      contact: {
        phone: '+1 (555) 123-4567',
        email: 'contact@greenvalleyfarms.com'
      }
    },
    {
      id: 2,
      name: 'Sunshine Farm',
      image: '/images/farmer2.jpg',
      location: 'Florida, USA',
      rating: 4.6,
      products: ['Citrus Fruits', 'Tropical Produce'],
      description: 'Sustainable farming practices with focus on tropical and citrus fruits.',
      contact: {
        phone: '+1 (555) 234-5678',
        email: 'info@sunshinefarm.com'
      }
    },
    {
      id: 3,
      name: 'Dairy Delight',
      image: '/images/farmer3.jpg',
      location: 'Wisconsin, USA',
      rating: 4.9,
      products: ['Milk', 'Cheese', 'Yogurt'],
      description: 'Premium dairy products from happy, grass-fed cows.',
      contact: {
        phone: '+1 (555) 345-6789',
        email: 'hello@dairydelight.com'
      }
    },
    {
      id: 4,
      name: 'Seed Masters',
      image: '/images/farmer4.jpg',
      location: 'Oregon, USA',
      rating: 4.7,
      products: ['Organic Seeds', 'Planting Kits'],
      description: 'Leading provider of high-quality organic seeds and gardening supplies.',
      contact: {
        phone: '+1 (555) 456-7890',
        email: 'grow@seedmasters.com'
      }
    }
  ]

  return (
    <div className="farmers-page">
      <div className="farmers-hero">
        <div className="container">
          <h1>Meet Our Farmers</h1>
          <p>Passionate growers dedicated to bringing you the freshest, highest quality produce</p>
        </div>
      </div>

      <div className="farmers-content section">
        <div className="container">
          <div className="farmers-grid">
            {farmers.map(farmer => (
              <div key={farmer.id} className="farmer-card card">
                <div className="farmer-image">
                  <div className="farmer-placeholder">
                    <FaUser />
                  </div>
                  <div className="farmer-rating">
                    <FaStar className="star" />
                    <span>{farmer.rating}</span>
                  </div>
                </div>
                
                <div className="farmer-info">
                  <h3>{farmer.name}</h3>
                  
                  <div className="farmer-location">
                    <FaMapMarkerAlt />
                    <span>{farmer.location}</span>
                  </div>
                  
                  <p className="farmer-description">{farmer.description}</p>
                  
                  <div className="farmer-products">
                    <h4>Specialties:</h4>
                    <div className="product-tags">
                      {farmer.products.map((product, index) => (
                        <span key={index} className="product-tag">{product}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="farmer-contact">
                    <h4>Contact:</h4>
                    <div className="contact-info">
                      <div className="contact-item">
                        <FaPhone />
                        <span>{farmer.contact.phone}</span>
                      </div>
                      <div className="contact-item">
                        <FaEnvelope />
                        <span>{farmer.contact.email}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button className="btn btn-primary view-products-btn">
                    View Products
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="become-farmer-cta">
            <div className="cta-content">
              <h2>Want to Join Our Farmer Community?</h2>
              <p>Connect with thousands of customers and grow your business with Roots to Farm</p>
              <div className="cta-buttons">
                <button className="btn btn-primary">Apply Now</button>
                <button className="btn btn-secondary">Learn More</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Farmers