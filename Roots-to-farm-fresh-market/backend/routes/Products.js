const express = require('express');
const Product = require('../models/Product');
const { auth, farmerAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

// Get all products with filtering and pagination
router.get('/', async(req, res) => {
    try {
        const {
            category,
            farmer,
            minPrice,
            maxPrice,
            isOrganic,
            search,
            page = 1,
            limit = 12,
            sort = 'createdAt'
        } = req.query;

        let query = { isAvailable: true };

        // Build filter query
        if (category) query.category = category;
        if (farmer) query.farmer = farmer;
        if (isOrganic) query.isOrganic = isOrganic === 'true';
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { farmName: { $regex: search, $options: 'i' } }
            ];
        }

        const products = await Product.find(query)
            .populate('farmer', 'name email phone')
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Product.countDocuments(query);

        res.json({
            success: true,
            products,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single product
router.get('/:id', async(req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('farmer', 'name email phone')
            .populate('reviews.user', 'name');

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ success: true, product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create product (Farmer only)
router.post('/', farmerAuth, upload.array('images', 5), async(req, res) => {
    try {
        const productData = {
            ...req.body,
            farmer: req.user.id,
            farmName: req.body.farmName || req.user.name
        };

        if (req.files) {
            productData.images = req.files.map(file => `/uploads/${file.filename}`);
        }

        const product = await Product.create(productData);

        res.status(201).json({ success: true, product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update product (Farmer only)
router.put('/:id', farmerAuth, upload.array('images', 5), async(req, res) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if user owns the product
        if (product.farmer.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const updateData = {...req.body };

        if (req.files && req.files.length > 0) {
            updateData.images = req.files.map(file => `/uploads/${file.filename}`);
        }

        product = await Product.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });

        res.json({ success: true, product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete product (Farmer only)
router.delete('/:id', farmerAuth, async(req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.farmer.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        await Product.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add review to product
router.post('/:id/reviews', auth, async(req, res) => {
    try {
        const { rating, comment } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if user already reviewed
        const alreadyReviewed = product.reviews.find(
            review => review.user.toString() === req.user.id
        );

        if (alreadyReviewed) {
            return res.status(400).json({ message: 'Product already reviewed' });
        }

        const review = {
            user: req.user.id,
            rating: Number(rating),
            comment
        };

        product.reviews.push(review);
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

        await product.save();
        res.status(201).json({ success: true, message: 'Review added successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;