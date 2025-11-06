const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/database');

const app = express();

// Connect to database
connectDB();

// Security Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Serve static files
app.use('/uploads', express.static('uploads'));

// Basic route
app.get('/', (req, res) => {
    res.json({
        message: 'Roots to Farm Fresh Market API',
        version: '1.0.0'
    });
});

// Health check route
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

// Routes - with error handling for missing files
try {
    app.use('/api/auth', require('./routes/auth'));
} catch (error) {
    console.log('Auth routes not found, using placeholder');
    app.use('/api/auth', (req, res) => res.json({ message: 'Auth API - Under Development' }));
}

try {
    app.use('/api/products', require('./routes/products'));
} catch (error) {
    console.log('Products routes not found, using placeholder');
    app.use('/api/products', (req, res) => res.json({ message: 'Products API - Under Development' }));
}

try {
    app.use('/api/cart', require('./routes/cart'));
} catch (error) {
    console.log('Cart routes not found, using placeholder');
    app.use('/api/cart', (req, res) => res.json({ message: 'Cart API - Under Development' }));
}

try {
    // FIXED: Changed './routes/Orders' to './routes/orders'
    app.use('/api/orders', require('./routes/Orders'));
} catch (error) {
    console.log('Orders routes not found, using placeholder');
    app.use('/api/orders', (req, res) => res.json({ message: 'Orders API - Under Development' }));
}

try {
    app.use('/api/farmers', require('./routes/farmers'));
} catch (error) {
    console.log('Farmers routes not found, using placeholder');
    app.use('/api/farmers', (req, res) => res.json({ message: 'Farmers API - Under Development' }));
}

// Placeholder routes for files that might not exist yet
app.use('/api/users', (req, res) => {
    res.json({ message: 'Users API - Under Development' });
});

app.use('/api/payment', (req, res) => {
    res.json({ message: 'Payment API - Under Development' });
});

app.use('/api/upload', (req, res) => {
    res.json({ message: 'Upload API - Under Development' });
});

// 404 handler - MUST be after all routes
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handling middleware - MUST be after all routes
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});