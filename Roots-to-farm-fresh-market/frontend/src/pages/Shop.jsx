import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { productsAPI } from '../services/api'
import { useCart } from '../context/CartContext'
import { FaSearch, FaFilter, FaShoppingCart, FaStar } from 'react-icons/fa'

// Import your images
import c from '../assets/c.png' // carrots
import t from '../assets/t.png' // tomatoes
import s from '../assets/s.png' // spinach
import p from '../assets/p.png' // bell peppers
import ap from '../assets/ap.png' // apples
import ba from '../assets/ba.png' // bananas
import st from '../assets/st.png' // strawberries
import o from '../assets/o.png' // oranges
import m from '../assets/m.png'
import k from '../assets/k.png'
import logo from '../assets/logo.png' // placeholder or milk

import './Shop.css'

const Shop = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    isOrganic: '',
    search: '',
    sort: 'createdAt'
  })
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0
  })
  const [showFilters, setShowFilters] = useState(false)

  const { addToCart } = useCart()

  useEffect(() => {
    fetchProducts()
  }, [filters, pagination.page])

  // Mock data with 4 vegetables and 4 fruits using your images
  const mockProducts = [
    // Vegetables
    {
      _id: 1,
      name: 'Fresh Carrots',
      category: 'vegetables',
      price: 2.49,
      originalPrice: 3.99,
      images: [c],
      farmName: 'Green Valley Farms',
      rating: 4.2,
      isOrganic: true,
      stock: 30,
      unit: 'kg'
    },
    {
      _id: 2,
      name: 'Organic Tomatoes',
      category: 'vegetables',
      price: 3.99,
      images: [t],
      farmName: 'Sunshine Farm',
      rating: 4.5,
      isOrganic: true,
      stock: 25,
      unit: 'kg'
    },
    {
      _id: 3,
      name: 'Fresh Spinach',
      category: 'vegetables',
      price: 1.99,
      images: [s],
      farmName: 'Leafy Greens Co.',
      rating: 4.3,
      isOrganic: false,
      stock: 40,
      unit: 'bunch'
    },
    {
      _id: 4,
      name: 'Bell Peppers',
      category: 'vegetables',
      price: 4.49,
      images: [p],
      farmName: 'Colorful Harvest',
      rating: 4.1,
      isOrganic: true,
      stock: 20,
      unit: 'kg'
    },
    // Fruits
    {
      _id: 5,
      name: 'Organic Apples',
      category: 'fruits',
      price: 3.99,
      images: [ap],
      farmName: 'Orchard Fresh',
      rating: 4.6,
      isOrganic: true,
      stock: 50,
      unit: 'kg'
    },
    {
      _id: 6,
      name: 'Fresh Bananas',
      category: 'fruits',
      price: 2.99,
      originalPrice: 3.49,
      images: [ba],
      farmName: 'Tropical Delight',
      rating: 4.4,
      isOrganic: false,
      stock: 35,
      unit: 'kg'
    },
    {
      _id: 7,
      name: 'Sweet Strawberries',
      category: 'fruits',
      price: 5.99,
      images: [st],
      farmName: 'Berry Best Farms',
      rating: 4.8,
      isOrganic: true,
      stock: 15,
      unit: 'pack'
    },
    {
      _id: 8,
      name: 'Juicy Oranges',
      category: 'fruits',
      price: 3.49,
      images: [o],
      farmName: 'Citrus Grove',
      rating: 4.2,
      isOrganic: false,
      stock: 45,
      unit: 'kg'
    },
    // Additional products to fill out the grid
    {
      _id: 9,
      name: 'Farm Fresh Milk',
      category: 'dairy',
      price: 4.99,
      images: [m], // Using logo as placeholder for milk
      farmName: 'Dairy Delight',
      rating: 4.7,
      isOrganic: true,
      stock: 20,
      unit: 'liter'
    },
    {
      _id: 10,
      name: 'Free Range Eggs',
      category: 'dairy',
      price: 6.99,
      images: [k], // Using logo as placeholder for eggs
      farmName: 'Happy Hens Farm',
      rating: 4.9,
      isOrganic: true,
      stock: 25,
      unit: 'dozen'
    }
  ]

  const fetchProducts = async () => {
    try {
      setLoading(true)
      // For now, using mock data. Replace with actual API call when ready
      // const response = await productsAPI.getAll({
      //   ...filters,
      //   page: pagination.page,
      //   limit: 12
      // })
      
      // Simulate API delay
      setTimeout(() => {
        // Filter mock products based on current filters
        let filteredProducts = [...mockProducts]
        
        // Apply category filter
        if (filters.category) {
          filteredProducts = filteredProducts.filter(
            product => product.category === filters.category
          )
        }
        
        // Apply search filter
        if (filters.search) {
          filteredProducts = filteredProducts.filter(
            product => product.name.toLowerCase().includes(filters.search.toLowerCase())
          )
        }
        
        // Apply price range filter
        if (filters.minPrice) {
          filteredProducts = filteredProducts.filter(
            product => product.price >= parseFloat(filters.minPrice)
          )
        }
        if (filters.maxPrice) {
          filteredProducts = filteredProducts.filter(
            product => product.price <= parseFloat(filters.maxPrice)
          )
        }
        
        // Apply organic filter
        if (filters.isOrganic === 'true') {
          filteredProducts = filteredProducts.filter(
            product => product.isOrganic === true
          )
        }
        
        // Apply sorting
        filteredProducts.sort((a, b) => {
          switch (filters.sort) {
            case 'price':
              return a.price - b.price
            case '-price':
              return b.price - a.price
            case 'rating':
              return (a.rating || 0) - (b.rating || 0)
            case 'name':
              return a.name.localeCompare(b.name)
            default: // 'createdAt' - using ID as proxy
              return b._id - a._id
          }
        })
        
        setProducts(filteredProducts)
        setPagination(prev => ({
          ...prev,
          totalPages: Math.ceil(filteredProducts.length / 12),
          total: filteredProducts.length
        }))
        setLoading(false)
      }, 500)
      
    } catch (error) {
      console.error('Error fetching products:', error)
      // Fallback to mock data on error
      setProducts(mockProducts)
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handleAddToCart = async (product) => {
    await addToCart(product._id, 1)
    // You might want to show a success message here
  }

  const categories = ['vegetables', 'fruits', 'dairy', 'grains', 'herbs', 'organic', 'other']

  return (
    <div className="shop-page">
      <div className="shop-hero">
        <div className="container">
          <h1>Fresh Farm Products</h1>
          <p>Direct from local farmers to your table</p>
        </div>
      </div>

      <div className="shop-content">
        <div className="container">
          {/* Search and Filters */}
          <div className="shop-controls">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>

            <div className="control-buttons">
              <button 
                className="btn btn-outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FaFilter />
                Filters
              </button>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="sort-select"
              >
                <option value="createdAt">Newest</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="rating">Rating</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="filters-panel">
              <div className="filter-group">
                <label>Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Price Range</label>
                <div className="price-range">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  />
                  <span>to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  />
                </div>
              </div>

              <div className="filter-group">
                <label>
                  <input
                    type="checkbox"
                    checked={filters.isOrganic === 'true'}
                    onChange={(e) => handleFilterChange('isOrganic', e.target.checked ? 'true' : '')}
                  />
                  Organic Only
                </label>
              </div>
            </div>
          )}

          {/* Products Grid */}
          {loading ? (
            <div className="loading">Loading products...</div>
          ) : (
            <>
              <div className="products-grid">
                {products.map(product => (
                  <div key={product._id} className="product-card">
                    <Link to={`/product/${product._id}`} className="product-image">
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        onError={(e) => {
                          e.target.src = logo // Fallback to logo if image fails
                        }}
                      />
                      {product.isOrganic && (
                        <span className="organic-badge">Organic</span>
                      )}
                    </Link>

                    <div className="product-info">
                      <Link to={`/product/${product._id}`} className="product-name">
                        <h3>{product.name}</h3>
                      </Link>
                      <p className="farm-name">By {product.farmName}</p>
                      
                      <div className="product-rating">
                        <FaStar className="star" />
                        <span>{product.rating || 'No ratings'}</span>
                      </div>

                      <div className="product-price">
                        <span className="current-price">${product.price}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="original-price">${product.originalPrice}</span>
                        )}
                        <span className="price-unit"> / {product.unit}</span>
                      </div>

                      <div className="product-stock">
                        {product.stock > 0 ? (
                          <span className="in-stock">{product.stock} in stock</span>
                        ) : (
                          <span className="out-of-stock">Out of stock</span>
                        )}
                      </div>

                      <button
                        className="btn btn-primary add-to-cart"
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                      >
                        <FaShoppingCart />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="pagination">
                  <button
                    disabled={pagination.page === 1}
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  >
                    Previous
                  </button>
                  
                  <span>
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  
                  <button
                    disabled={pagination.page === pagination.totalPages}
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Shop