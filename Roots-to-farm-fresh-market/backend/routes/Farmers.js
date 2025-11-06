const express = require('express');
const Farmer = require('../models/Farmer');
const Product = require('../models/Product');
const User = require('../models/User');
const { auth, farmerAuth } = require('../middleware/auth');
const router = express.Router();

// Get all farmers
router.get('/', async(req, res) => {
    try {
        const farmers = await Farmer.find({ isVerified: true })
            .populate('user', 'name email phone avatar')
            .select('-__v');

        res.json({ success: true, farmers });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get farmer by ID
router.get('/:id', async(req, res) => {
    try {
        const farmer = await Farmer.findById(req.params.id)
            .populate('user', 'name email phone avatar')
            .select('-__v');

        if (!farmer) {
            return res.status(404).json({ message: 'Farmer not found' });
        }

        // Get farmer's products
        const products = await Product.find({
            farmer: farmer.user._id,
            isAvailable: true
        }).select('name price images category rating');

        res.json({
            success: true,
            farmer: {
                ...farmer.toObject(),
                products
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create farmer profile
router.post('/profile', farmerAuth, async(req, res) => {
    try {
        const {
            farmName,
            farmDescription,
            farmLocation,
            farmSize,
            farmingMethods,
            certifications,
            yearsOfExperience,
            contactInfo,
            socialMedia
        } = req.body;

        // Check if profile already exists
        const existingProfile = await Farmer.findOne({ user: req.user.id });
        if (existingProfile) {
            return res.status(400).json({ message: 'Farmer profile already exists' });
        }

        const farmer = await Farmer.create({
            user: req.user.id,
            farmName,
            farmDescription,
            farmLocation,
            farmSize,
            farmingMethods,
            certifications,
            yearsOfExperience,
            contactInfo,
            socialMedia
        });

        await farmer.populate('user', 'name email phone avatar');

        res.status(201).json({ success: true, farmer });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update farmer profile
router.put('/profile', farmerAuth, async(req, res) => {
    try {
        const farmer = await Farmer.findOneAndUpdate({ user: req.user.id },
            req.body, { new: true, runValidators: true }
        ).populate('user', 'name email phone avatar');

        if (!farmer) {
            return res.status(404).json({ message: 'Farmer profile not found' });
        }

        res.json({ success: true, farmer });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get farmer's products
router.get('/:id/products', async(req, res) => {
    try {
        const farmer = await Farmer.findById(req.params.id);
        if (!farmer) {
            return res.status(404).json({ message: 'Farmer not found' });
        }

        const products = await Product.find({
            farmer: farmer.user,
            isAvailable: true
        }).populate('farmer', 'name');

        res.json({ success: true, products });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get farmer dashboard stats
router.get('/dashboard/stats', farmerAuth, async(req, res) => {
    try {
        const farmer = await Farmer.findOne({ user: req.user.id });
        if (!farmer) {
            return res.status(404).json({ message: 'Farmer profile not found' });
        }

        const totalProducts = await Product.countDocuments({ farmer: req.user.id });
        const availableProducts = await Product.countDocuments({
            farmer: req.user.id,
            isAvailable: true
        });
        const lowStockProducts = await Product.countDocuments({
            farmer: req.user.id,
            stock: { $lt: 10 },
            isAvailable: true
        });

        // Get recent orders for this farmer's products
        const Order = require('../models/Order');
        const recentOrders = await Order.find({
            'items.farmer': req.user.id,
            orderStatus: { $in: ['pending', 'confirmed', 'processing'] }
        }).populate('user', 'name').sort('-createdAt').limit(5);

        res.json({
            success: true,
            stats: {
                totalProducts,
                availableProducts,
                lowStockProducts,
                totalSales: farmer.totalSales,
                rating: farmer.rating
            },
            recentOrders
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;