const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');
const { sendEmail } = require('../utils/Emailservice'); // Fixed typo: should be EmailService
const User = require('../models/User');
const router = express.Router();

// Create new order

router.get('/', (req, res) => {
    res.json({ message: 'Orders API - Under Development' });
})
router.post('/', auth, async(req, res) => {
    try {
        const { shippingAddress, paymentMethod } = req.body;

        // Get user's cart
        const cart = await Cart.findOne({ user: req.user.id })
            .populate('items.product');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Check stock availability and prepare order items
        const orderItems = [];
        for (const item of cart.items) {
            const product = await Product.findById(item.product._id);

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for ${product.name}`
                });
            }

            orderItems.push({
                product: item.product._id,
                name: item.product.name,
                price: item.product.price,
                quantity: item.quantity,
                farmer: item.product.farmer
            });

            // Update product stock
            product.stock -= item.quantity;
            await product.save();
        }

        // Create order
        const order = await Order.create({
            user: req.user.id,
            items: orderItems,
            totalAmount: cart.totalAmount,
            shippingAddress,
            paymentMethod
        });

        // Clear cart
        cart.items = [];
        await cart.save();

        // Send order confirmation email to customer
        try {
            await sendEmail(
                req.user.email,
                'orderConfirmation', [order, req.user]
            );
        } catch (emailError) {
            console.error('Failed to send order confirmation email:', emailError);
            // Don't fail the order if email fails
        }

        // Send notifications to farmers
        try {
            const farmerEmails = new Set();
            for (const item of order.items) {
                const farmer = await User.findById(item.farmer);
                if (farmer && farmer.email) {
                    farmerEmails.add(farmer.email);
                }
            }

            for (const farmerEmail of farmerEmails) {
                const farmer = await User.findOne({ email: farmerEmail });
                const farmerItems = order.items.filter(item =>
                    item.farmer.toString() === farmer._id.toString()
                );

                await sendEmail(
                    farmerEmail,
                    'farmerOrderNotification', [order, farmer, farmerItems]
                );
            }
        } catch (farmerEmailError) {
            console.error('Failed to send farmer notifications:', farmerEmailError);
            // Don't fail the order if farmer emails fail
        }

        res.status(201).json({ success: true, order });

    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get user's orders
router.get('/my-orders', auth, async(req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .populate('items.product', 'name images')
            .sort('-createdAt');

        res.json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single order
router.get('/:id', auth, async(req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.product', 'name images farmName')
            .populate('user', 'name email');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user owns the order or is admin
        if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json({ success: true, order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update order status (Admin/Farmer)
router.put('/:id/status', auth, async(req, res) => {
    try {
        const { orderStatus } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user is admin or farmer associated with the order
        const isFarmerInOrder = order.items.some(
            item => item.farmer.toString() === req.user.id
        );

        if (req.user.role !== 'admin' && !isFarmerInOrder) {
            return res.status(403).json({ message: 'Access denied' });
        }

        order.orderStatus = orderStatus;
        await order.save();

        res.json({ success: true, order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Cancel order
router.put('/:id/cancel', auth, async(req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        if (['delivered', 'shipped'].includes(order.orderStatus)) {
            return res.status(400).json({ message: 'Cannot cancel order at this stage' });
        }

        // Restore product stock
        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: item.quantity }
            });
        }

        order.orderStatus = 'cancelled';
        await order.save();

        res.json({ success: true, message: 'Order cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;