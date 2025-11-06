import React from 'react'
import { FaLeaf, FaUsers, FaTree, FaWater, FaSun, FaAward } from 'react-icons/fa'
import './Impact.css'

const Impact = () => {
  const stats = [
    {
      icon: <FaLeaf />,
      number: '500+',
      label: 'Farmers Empowered',
      description: 'Local farmers connected directly to consumers'
    },
    {
      icon: <FaUsers />,
      number: '10,000+',
      label: 'Families Served',
      description: 'Households receiving fresh produce weekly'
    },
    {
      icon: <FaTree />,
      number: '50%',
      label: 'Reduced Food Miles',
      description: 'Average reduction in transportation distance'
    },
    {
      icon: <FaWater />,
      number: '30%',
      label: 'Water Saved',
      description: 'Through sustainable farming practices'
    }
  ]

  const initiatives = [
    {
      title: 'Farmer Training Program',
      description: 'Providing modern farming techniques and sustainable practices to local farmers.',
      achievements: [
        'Trained 200+ farmers in organic farming',
        'Increased yield by 40% on average',
        'Reduced chemical usage by 60%'
      ]
    },
    {
      title: 'Community Supported Agriculture',
      description: 'Direct partnerships between communities and local farms for seasonal produce.',
      achievements: [
        '50+ community partnerships established',
        '2000+ CSA memberships active',
        '95% member retention rate'
      ]
    },
    {
      title: 'Food Waste Reduction',
      description: 'Innovative programs to minimize food waste from farm to table.',
      achievements: [
        'Reduced farm waste by 70%',
        'Donated 50,000+ meals to food banks',
        'Implemented composting initiatives'
      ]
    }
  ]

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      role: 'Local Farmer',
      quote: 'Roots to Farm has transformed my business. I now earn 3x more while serving my community directly.',
      rating: 5
    },
    {
      name: 'Priya Sharma',
      role: 'Regular Customer',
      quote: 'The quality and freshness of produce is unmatched. I feel good supporting local farmers.',
      rating: 5
    },
    {
      name: 'Dr. Anil Patel',
      role: 'Agricultural Expert',
      quote: 'This platform is revolutionizing how we think about food distribution in India.',
      rating: 5
    }
  ]

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>
        ★
      </span>
    ))
  }

  return (
    <div className="impact-page">
      {/* Hero Section */}
      <section className="impact-hero">
        <div className="container">
          <h1>Our Impact</h1>
          <p>Transforming agriculture and communities through direct farm-to-consumer connections</p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="impact-stats">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-icon">
                  {stat.icon}
                </div>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
                <div className="stat-description">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Initiatives Section */}
      <section className="initiatives-section">
        <div className="container">
          <h2 className="section-title">Our Initiatives</h2>
          <div className="initiatives-grid">
            {initiatives.map((initiative, index) => (
              <div key={index} className="initiative-card card">
                <div className="initiative-image">
                  <div className="image-placeholder">
                    {index === 0 && <FaLeaf />}
                    {index === 1 && <FaUsers />}
                    {index === 2 && <FaTree />}
                  </div>
                </div>
                <div className="initiative-content">
                  <h3>{initiative.title}</h3>
                  <p>{initiative.description}</p>
                  <ul className="achievements-list">
                    {initiative.achievements.map((achievement, i) => (
                      <li key={i}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Environment Section */}
      <section className="environment-section">
        <div className="container">
          <div className="environment-content">
            <div className="environment-text">
              <h2>Environmental Impact</h2>
              <p>
                Our direct farm-to-consumer model significantly reduces the environmental footprint 
                of food distribution. By eliminating multiple intermediaries and optimizing logistics, 
                we're creating a more sustainable food system for future generations.
              </p>
              <div className="environment-stats">
                <div className="env-stat">
                  <div className="env-icon">
                    <FaSun />
                  </div>
                  <div>
                    <div className="env-number">65%</div>
                    <div className="env-label">Reduced Carbon Emissions</div>
                  </div>
                </div>
                <div className="env-stat">
                  <div className="env-icon">
                    <FaWater />
                  </div>
                  <div>
                    <div className="env-number">45%</div>
                    <div className="env-label">Less Packaging Waste</div>
                  </div>
                </div>
                <div className="env-stat">
                  <div className="env-icon">
                    <FaTree />
                  </div>
                  <div>
                    <div className="env-number">80%</div>
                    <div className="env-label">Organic Farms</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="environment-image">
              <div className="image-placeholder">
                <FaLeaf />
                <span>Sustainable Farming Practices</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">Success Stories</h2>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card card">
                <div className="testimonial-header">
                  <div className="testimonial-image">
                    <FaUsers />
                  </div>
                  <div className="testimonial-info">
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.role}</p>
                  </div>
                </div>
                <div className="testimonial-quote">
                  {testimonial.quote}
                </div>
                <div className="testimonial-rating">
                  {renderStars(testimonial.rating)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="impact-cta">
        <div className="container">
          <div className="cta-content">
            <FaAward className="cta-icon" />
            <h2>Join Our Mission</h2>
            <p>Be part of the movement creating positive change in agriculture</p>
            <div className="cta-buttons">
              <button className="btn btn-primary">Support Our Cause</button>
              <button className="btn btn-secondary">Learn More</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Impact