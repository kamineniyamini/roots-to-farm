import React from 'react'
import { FaLeaf, FaSeedling, FaHandsHelping, FaChartLine, FaUsers, FaAward } from 'react-icons/fa'
import './About.css'

const About = () => {
  const stats = [
    { number: '500+', label: 'Happy Farmers' },
    { number: '10,000+', label: 'Satisfied Customers' },
    { number: '50+', label: 'Cities Served' },
    { number: '95%', label: 'Customer Satisfaction' }
  ]

  const values = [
    {
      icon: <FaLeaf />,
      title: 'Sustainability',
      description: 'We promote eco-friendly farming practices and reduce food waste through direct farm-to-consumer model.'
    },
    {
      icon: <FaUsers />,
      title: 'Community',
      description: 'Building strong connections between farmers and consumers to strengthen local economies.'
    },
    {
      icon: <FaSeedling />, // Fixed: Replaced FaTarget with FaSeedling
      title: 'Quality',
      description: 'Ensuring the highest standards of freshness and quality in every product we deliver.'
    },
    {
      icon: <FaHandsHelping />, // Fixed: Replaced FaHandHoldingHeart with FaHandsHelping
      title: 'Fairness',
      description: 'Providing fair prices for farmers while keeping products affordable for consumers.'
    }
  ]

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="hero-content">
            <h1>Our Story</h1>
            <p className="hero-subtitle">
              From humble beginnings to revolutionizing the farm-to-table experience
            </p>
            <div className="hero-stats">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section section">
        <div className="container">
          <div className="mission-grid">
            <div className="mission-content">
              <h2>Our Mission</h2>
              <p>
                At Roots to Farm, we're on a mission to transform the way people access fresh, 
                healthy food while supporting local farmers. We believe everyone deserves access 
                to high-quality, sustainably grown produce directly from the source.
              </p>
              <p>
                Founded in 2020, we started as a small initiative connecting local farmers with 
                their communities. Today, we've grown into a platform that empowers hundreds of 
                farmers and serves thousands of families across the country.
              </p>
            </div>
            <div className="mission-image">
              <div className="image-placeholder">
                <FaLeaf />
                <span>Our Farm Community</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section section">
        <div className="container">
          <h2 className="section-title">Our Values</h2>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card card">
                <div className="value-icon">
                  {value.icon}
                </div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section section">
        <div className="container">
          <h2 className="section-title">Leadership Team</h2>
          <div className="team-grid">
            <div className="team-member card">
              <div className="member-image">
                <div className="member-placeholder">
                  <FaUsers />
                </div>
              </div>
              <div className="member-info">
                <h3>Sarah Johnson</h3>
                <p className="member-role">CEO & Founder</p>
                <p className="member-bio">
                  Former agricultural scientist with 15 years of experience in sustainable farming.
                </p>
              </div>
            </div>
            <div className="team-member card">
              <div className="member-image">
                <div className="member-placeholder">
                  <FaUsers />
                </div>
              </div>
              <div className="member-info">
                <h3>Michael Chen</h3>
                <p className="member-role">CTO</p>
                <p className="member-bio">
                  Technology expert passionate about using innovation to solve food system challenges.
                </p>
              </div>
            </div>
            <div className="team-member card">
              <div className="member-image">
                <div className="member-placeholder">
                  <FaUsers />
                </div>
              </div>
              <div className="member-info">
                <h3>Elena Rodriguez</h3>
                <p className="member-role">Head of Farmer Relations</p>
                <p className="member-bio">
                  Third-generation farmer dedicated to supporting the farming community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="container">
          <div className="cta-content">
            <FaAward className="cta-icon" />
            <h2>Join Our Movement</h2>
            <p>Be part of the revolution in fresh food distribution</p>
            <div className="cta-buttons">
              <button className="btn btn-primary">Shop Fresh</button>
              <button className="btn btn-secondary">Become a Partner</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About