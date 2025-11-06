const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { auth } = require('../middleware/auth');
const Order = require('../models/Order');
const router = express.Router();

// Create payment intent
router.post('/create-payment-intent', auth, async(req, res) => {
    try {
        const { orderId } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Calculate total amount in cents (Stripe uses cents)
        const totalAmount = Math.round(order.totalAmount * 100);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalAmount,
            currency: 'usd',
            metadata: {
                orderId: order._id.toString(),
                userId: req.user.id
            },
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });
    } catch (error) {
        console.error('Payment intent error:', error);
        res.status(500).json({ message: 'Payment processing failed' });
    }
});

// Handle payment success
router.post('/webhook', express.raw({ type: 'application/json' }), async(req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('Webhook signature verification failed.', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            await handlePaymentSuccess(paymentIntent);
            break;
        case 'payment_intent.payment_failed':
            const failedPayment = event.data.object;
            await handlePaymentFailure(failedPayment);
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
});

const handlePaymentSuccess = async(paymentIntent) => {
    try {
        const orderId = paymentIntent.metadata.orderId;
        await Order.findByIdAndUpdate(orderId, {
            paymentStatus: 'completed',
            orderStatus: 'confirmed'
        });

        console.log(`Payment succeeded for order ${orderId}`);
    } catch (error) {
        console.error('Error handling payment success:', error);
    }
};

const handlePaymentFailure = async(paymentIntent) => {
    try {
        const orderId = paymentIntent.metadata.orderId;
        await Order.findByIdAndUpdate(orderId, {
            paymentStatus: 'failed'
        });

        console.log(`Payment failed for order ${orderId}`);
    } catch (error) {
        console.error('Error handling payment failure:', error);
    }
};

module.exports = router;