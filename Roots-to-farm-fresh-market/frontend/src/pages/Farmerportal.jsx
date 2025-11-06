import React, { useState, useEffect } from 'react'
import { farmersAPI, productsAPI, uploadAPI } from '../services/api'
import { FaPlus, FaEdit, FaTrash, FaUpload, FaChartLine, FaBox, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa'
import './Farmerportal.css'

const FarmerPortal = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [products, setProducts] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'vegetables',
    stock: '',
    unit: 'kg',
    isOrganic: false,
    images: []
  })
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [statsResponse, productsResponse] = await Promise.all([
        farmersAPI.getDashboardStats(),
        productsAPI.getAll({ farmer: 'current' })
      ])
      
      setStats(statsResponse.data)
      setProducts(productsResponse.data.products)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageUpload = async (files) => {
    try {
      setUploading(true)
      const response = await uploadAPI.multiple(files)
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...response.data.files.map(file => file.path)]
      }))
    } catch (error) {
      console.error('Error uploading images:', error)
      alert('Failed to upload images')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingProduct) {
        await productsAPI.update(editingProduct._id, formData)
      } else {
        await productsAPI.create(formData)
      }
      
      setShowProductForm(false)
      setEditingProduct(null)
      setFormData({
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        category: 'vegetables',
        stock: '',
        unit: 'kg',
        isOrganic: false,
        images: []
      })
      fetchData()
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Failed to save product')
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice || '',
      category: product.category,
      stock: product.stock,
      unit: product.unit,
      isOrganic: product.isOrganic,
      images: product.images || []
    })
    setShowProductForm(true)
  }

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsAPI.delete(productId)
        fetchData()
      } catch (error) {
        console.error('Error deleting product:', error)
        alert('Failed to delete product')
      }
    }
  }

  const categories = ['vegetables', 'fruits', 'dairy', 'grains', 'herbs', 'organic', 'other']
  const units = ['kg', 'g', 'lb', 'piece', 'bunch', 'dozen']

  if (loading) {
    return (
      <div className="farmer-portal">
        <div className="container">
          <div className="loading">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="farmer-portal">
      <div className="container">
        <div className="portal-header">
          <h1>Farmer Portal</h1>
          <p>Manage your farm products and track your business</p>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="stats-overview">
            <div className="stat-card">
              <div className="stat-icon">
                <FaBox />
              </div>
              <div className="stat-info">
                <h3>{stats.stats?.totalProducts || 0}</h3>
                <p>Total Products</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <FaCheckCircle />
              </div>
              <div className="stat-info">
                <h3>{stats.stats?.availableProducts || 0}</h3>
                <p>Available Products</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon warning">
                <FaExclamationTriangle />
              </div>
              <div className="stat-info">
                <h3>{stats.stats?.lowStockProducts || 0}</h3>
                <p>Low Stock</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <FaChartLine />
              </div>
              <div className="stat-info">
                <h3>${stats.stats?.totalSales || 0}</h3>
                <p>Total Sales</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="portal-tabs">
          <button 
            className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`tab ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            Products
          </button>
          <button 
            className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="tab-content">
            <div className="dashboard-content">
              <div className="recent-orders">
                <h3>Recent Orders</h3>
                {stats.recentOrders && stats.recentOrders.length > 0 ? (
                  <div className="orders-list">
                    {stats.recentOrders.map(order => (
                      <div key={order._id} className="order-item">
                        <div className="order-info">
                          <strong>Order #{order._id.slice(-8).toUpperCase()}</strong>
                          <span>Customer: {order.user?.name}</span>
                        </div>
                        <div className="order-status">
                          <span className={`status ${order.orderStatus}`}>
                            {order.orderStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No recent orders</p>
                )}
              </div>

              <div className="quick-actions">
                <h3>Quick Actions</h3>
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    setActiveTab('products')
                    setShowProductForm(true)
                  }}
                >
                  <FaPlus />
                  Add New Product
                </button>
                <button className="btn btn-outline">
                  View All Orders
                </button>
                <button className="btn btn-outline">
                  Update Stock
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="tab-content">
            <div className="products-header">
              <h3>Your Products</h3>
              <button 
                className="btn btn-primary"
                onClick={() => setShowProductForm(true)}
              >
                <FaPlus />
                Add Product
              </button>
            </div>

            {showProductForm && (
              <div className="product-form-modal">
                <div className="modal-content">
                  <div className="modal-header">
                    <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                    <button 
                      className="close-btn"
                      onClick={() => {
                        setShowProductForm(false)
                        setEditingProduct(null)
                        setFormData({
                          name: '',
                          description: '',
                          price: '',
                          originalPrice: '',
                          category: 'vegetables',
                          stock: '',
                          unit: 'kg',
                          isOrganic: false,
                          images: []
                        })
                      }}
                    >
                      ×
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="product-form">
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Product Name *</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Category *</label>
                        <select
                          value={formData.category}
                          onChange={(e) => handleInputChange('category', e.target.value)}
                          required
                        >
                          {categories.map(cat => (
                            <option key={cat} value={cat}>
                              {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Price ($) *</label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) => handleInputChange('price', e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Original Price ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.originalPrice}
                          onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label>Stock *</label>
                        <input
                          type="number"
                          value={formData.stock}
                          onChange={(e) => handleInputChange('stock', e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Unit *</label>
                        <select
                          value={formData.unit}
                          onChange={(e) => handleInputChange('unit', e.target.value)}
                          required
                        >
                          {units.map(unit => (
                            <option key={unit} value={unit}>
                              {unit}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group full-width">
                        <label>Description *</label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                          required
                          rows="4"
                        />
                      </div>

                      <div className="form-group">
                        <label>
                          <input
                            type="checkbox"
                            checked={formData.isOrganic}
                            onChange={(e) => handleInputChange('isOrganic', e.target.checked)}
                          />
                          Organic Product
                        </label>
                      </div>

                      <div className="form-group full-width">
                        <label>Product Images</label>
                        <div className="image-upload">
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => handleImageUpload(Array.from(e.target.files))}
                            disabled={uploading}
                          />
                          {uploading && <span>Uploading...</span>}
                        </div>
                        <div className="image-preview">
                          {formData.images.map((image, index) => (
                            <div key={index} className="preview-item">
                              <img src={image} alt={`Preview ${index + 1}`} />
                              <button
                                type="button"
                                onClick={() => handleInputChange('images', formData.images.filter((_, i) => i !== index))}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="form-actions">
                      <button type="submit" className="btn btn-primary">
                        {editingProduct ? 'Update Product' : 'Add Product'}
                      </button>
                      <button 
                        type="button"
                        className="btn btn-outline"
                        onClick={() => {
                          setShowProductForm(false)
                          setEditingProduct(null)
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="products-grid">
              {products.map(product => (
                <div key={product._id} className="product-card">
                  <div className="product-image">
                    <img 
                      src={product.images?.[0] || '/placeholder-image.jpg'} 
                      alt={product.name}
                    />
                    {product.isOrganic && (
                      <span className="organic-badge">Organic</span>
                    )}
                  </div>

                  <div className="product-info">
                    <h4>{product.name}</h4>
                    <p className="category">{product.category}</p>
                    <p className="price">${product.price}</p>
                    <p className={`stock ${product.stock < 10 ? 'low' : ''}`}>
                      Stock: {product.stock} {product.unit}
                    </p>
                  </div>

                  <div className="product-actions">
                    <button 
                      className="btn btn-outline"
                      onClick={() => handleEdit(product)}
                    >
                      <FaEdit />
                      Edit
                    </button>
                    <button 
                      className="btn btn-outline delete"
                      onClick={() => handleDelete(product._id)}
                    >
                      <FaTrash />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {products.length === 0 && (
              <div className="empty-state">
                <FaBox className="empty-icon" />
                <h4>No products yet</h4>
                <p>Start by adding your first farm product</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowProductForm(true)}
                >
                  <FaPlus />
                  Add Your First Product
                </button>
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="tab-content">
            <h3>Your Orders</h3>
            <p>Order management coming soon...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default FarmerPortal