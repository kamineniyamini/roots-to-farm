import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { productsAPI } from '../services/api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { FaStar, FaShoppingCart, FaHeart, FaShare, FaArrowLeft } from 'react-icons/fa'
import './ProductDetail.css'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [addingToCart, setAddingToCart] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      const response = await productsAPI.getById(id)
      setProduct(response.data.product)
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/product/${id}` } })
      return
    }

    setAddingToCart(true)
    const result = await addToCart(product._id, quantity)
    
    if (result.success) {
      alert('Product added to cart!')
    } else {
      alert(result.message)
    }
    
    setAddingToCart(false)
  }

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/product/${id}` } })
      return
    }

    setAddingToCart(true)
    const result = await addToCart(product._id, quantity)
    
    if (result.success) {
      navigate('/cart')
    } else {
      alert(result.message)
    }
    
    setAddingToCart(false)
  }

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="loading">Loading product...</div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="not-found">
            <h2>Product not found</h2>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/shop')}
            >
              Back to Shop
            </button>
          </div>
        </div>
      </div>
    )
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar 
        key={i} 
        className={`star ${i < rating ? 'filled' : ''}`}
      />
    ))
  }

  return (
    <div className="product-detail-page">
      <div className="container">
        <button 
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft />
          Back
        </button>

        <div className="product-detail">
          {/* Product Images */}
          <div className="product-images">
            <div className="main-image">
              <img 
                src={product.images?.[selectedImage] || '/placeholder-image.jpg'} 
                alt={product.name}
              />
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="image-thumbnails">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info">
            <div className="product-header">
              <h1>{product.name}</h1>
              {product.isOrganic && (
                <span className="organic-badge">Organic</span>
              )}
            </div>

            <div className="product-meta">
              <p className="farm-name">By {product.farmName}</p>
              
              <div className="product-rating">
                {renderStars(Math.floor(product.rating))}
                <span>({product.reviews?.length || 0} reviews)</span>
              </div>
            </div>

            <div className="product-price">
              <span className="current-price">${product.price}</span>
              {product.originalPrice && (
                <span className="original-price">${product.originalPrice}</span>
              )}
            </div>

            <div className="product-description">
              <p>{product.description}</p>
            </div>

            <div className="product-details">
              <div className="detail-item">
                <strong>Category:</strong>
                <span>{product.category}</span>
              </div>
              <div className="detail-item">
                <strong>Unit:</strong>
                <span>{product.unit}</span>
              </div>
              <div className="detail-item">
                <strong>Stock:</strong>
                <span className={product.stock > 0 ? 'in-stock' : 'out-of-stock'}>
                  {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                </span>
              </div>
            </div>

            {/* Quantity and Actions */}
            {product.stock > 0 && (
              <div className="product-actions">
                <div className="quantity-selector">
                  <label>Quantity:</label>
                  <div className="quantity-controls">
                    <button
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span>{quantity}</span>
                    <button
                      onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="action-buttons">
                  <button
                    className="btn btn-outline add-to-cart"
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                  >
                    <FaShoppingCart />
                    {addingToCart ? 'Adding...' : 'Add to Cart'}
                  </button>
                  
                  <button
                    className="btn btn-primary buy-now"
                    onClick={handleBuyNow}
                    disabled={addingToCart}
                  >
                    {addingToCart ? 'Adding...' : 'Buy Now'}
                  </button>
                </div>
              </div>
            )}

            {/* Additional Actions */}
            <div className="additional-actions">
              <button className="action-btn">
                <FaHeart />
                Add to Wishlist
              </button>
              <button className="action-btn">
                <FaShare />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {product.reviews && product.reviews.length > 0 && (
          <div className="reviews-section">
            <h2>Customer Reviews</h2>
            <div className="reviews-list">
              {product.reviews.map((review, index) => (
                <div key={index} className="review">
                  <div className="review-header">
                    <strong>{review.user?.name || 'Anonymous'}</strong>
                    <div className="review-rating">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                  <span className="review-date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDetail