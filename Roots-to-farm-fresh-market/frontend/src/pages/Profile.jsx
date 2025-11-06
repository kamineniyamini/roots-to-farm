import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { farmersAPI } from '../services/api'
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave } from 'react-icons/fa'
import './Profile.css'

const Profile = () => {
  const { user, updateProfile } = useAuth()
  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [farmerProfile, setFarmerProfile] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India'
    }
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipCode: user.address?.zipCode || '',
          country: user.address?.country || 'India'
        }
      })
    }

    if (user?.role === 'farmer') {
      fetchFarmerProfile()
    }
  }, [user])

  const fetchFarmerProfile = async () => {
    try {
      const response = await farmersAPI.getDashboardStats()
      setFarmerProfile(response.data)
    } catch (error) {
      console.error('Error fetching farmer profile:', error)
    }
  }

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const result = await updateProfile(formData)
    
    if (result.success) {
      setEditMode(false)
    } else {
      alert(result.message)
    }

    setLoading(false)
  }

  const createFarmerProfile = async () => {
    // This would open a modal or navigate to farmer profile creation
    alert('Redirecting to farmer profile creation...')
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <h1>My Profile</h1>
          <button
            className="btn btn-outline"
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? <FaSave /> : <FaEdit />}
            {editMode ? 'Save Changes' : 'Edit Profile'}
          </button>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <div className="section-header">
              <FaUser className="section-icon" />
              <h2>Personal Information</h2>
            </div>

            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!editMode}
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="disabled-input"
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!editMode}
                  />
                </div>

                <div className="form-group">
                  <label>Account Type</label>
                  <input
                    type="text"
                    value={user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || ''}
                    disabled
                    className="disabled-input"
                  />
                </div>
              </div>

              <div className="section-header">
                <FaMapMarkerAlt className="section-icon" />
                <h2>Shipping Address</h2>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Street Address</label>
                  <input
                    type="text"
                    value={formData.address.street}
                    onChange={(e) => handleInputChange('address.street', e.target.value)}
                    disabled={!editMode}
                  />
                </div>

                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    value={formData.address.city}
                    onChange={(e) => handleInputChange('address.city', e.target.value)}
                    disabled={!editMode}
                  />
                </div>

                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    value={formData.address.state}
                    onChange={(e) => handleInputChange('address.state', e.target.value)}
                    disabled={!editMode}
                  />
                </div>

                <div className="form-group">
                  <label>ZIP Code</label>
                  <input
                    type="text"
                    value={formData.address.zipCode}
                    onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                    disabled={!editMode}
                  />
                </div>

                <div className="form-group">
                  <label>Country</label>
                  <input
                    type="text"
                    value={formData.address.country}
                    onChange={(e) => handleInputChange('address.country', e.target.value)}
                    disabled={!editMode}
                  />
                </div>
              </div>

              {editMode && (
                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => {
                      setEditMode(false)
                      // Reset form data
                      setFormData({
                        name: user.name || '',
                        phone: user.phone || '',
                        address: {
                          street: user.address?.street || '',
                          city: user.address?.city || '',
                          state: user.address?.state || '',
                          zipCode: user.address?.zipCode || '',
                          country: user.address?.country || 'India'
                        }
                      })
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Farmer Dashboard */}
          {user?.role === 'farmer' && (
            <div className="profile-section">
              <div className="section-header">
                <FaUser className="section-icon" />
                <h2>Farmer Dashboard</h2>
              </div>

              {farmerProfile ? (
                <div className="farmer-stats">
                  <div className="stat-card">
                    <h3>Total Products</h3>
                    <div className="stat-number">
                      {farmerProfile.stats?.totalProducts || 0}
                    </div>
                  </div>

                  <div className="stat-card">
                    <h3>Available Products</h3>
                    <div className="stat-number">
                      {farmerProfile.stats?.availableProducts || 0}
                    </div>
                  </div>

                  <div className="stat-card">
                    <h3>Low Stock</h3>
                    <div className="stat-number warning">
                      {farmerProfile.stats?.lowStockProducts || 0}
                    </div>
                  </div>

                  <div className="stat-card">
                    <h3>Total Sales</h3>
                    <div className="stat-number">
                      ${farmerProfile.stats?.totalSales || 0}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="no-farmer-profile">
                  <p>You haven't set up your farmer profile yet.</p>
                  <button 
                    className="btn btn-primary"
                    onClick={createFarmerProfile}
                  >
                    Create Farmer Profile
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile