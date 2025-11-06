const mongoose = require('mongoose');

// Cart Item Schema (embedded in Cart)
const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Product ID is required']
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [1, 'Quantity must be at least 1'],
        default: 1,
        validate: {
            validator: Number.isInteger,
            message: 'Quantity must be an integer'
        }
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    addedAt: {
        type: Date,
        default: Date.now
    }
}, {
    _id: true // Ensure each cart item has its own ID
});

// Main Cart Schema
const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
        unique: true // One cart per user
    },
    items: [cartItemSchema],
    totalAmount: {
        type: Number,
        default: 0,
        min: [0, 'Total amount cannot be negative']
    },
    totalItems: {
        type: Number,
        default: 0,
        min: [0, 'Total items cannot be negative']
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true, // Adds createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for calculating total amount (read-only)
cartSchema.virtual('calculatedTotal').get(function() {
    return this.items.reduce((total, item) => {
        return total + (item.quantity * item.price);
    }, 0);
});

// Virtual for calculating total items (read-only)
cartSchema.virtual('calculatedTotalItems').get(function() {
    return this.items.reduce((total, item) => {
        return total + item.quantity;
    }, 0);
});

// Pre-save middleware to update totals before saving
cartSchema.pre('save', function(next) {
    // Update calculated fields
    this.totalAmount = this.calculatedTotal;
    this.totalItems = this.calculatedTotalItems;
    this.lastUpdated = Date.now();

    next();
});

// Pre-find middleware to populate product details
cartSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'items.product',
        select: 'name images price stock farmName isAvailable category'
    });
    next();
});

// Instance method to add item to cart
cartSchema.methods.addItem = function(productId, quantity = 1, price) {
    const existingItemIndex = this.items.findIndex(
        item => item.product.toString() === productId.toString()
    );

    if (existingItemIndex > -1) {
        // Update existing item quantity
        this.items[existingItemIndex].quantity += quantity;
    } else {
        // Add new item
        this.items.push({
            product: productId,
            quantity: quantity,
            price: price
        });
    }

    return this.save();
};

// Instance method to update item quantity
cartSchema.methods.updateItemQuantity = function(itemId, newQuantity) {
    if (newQuantity < 1) {
        throw new Error('Quantity must be at least 1');
    }

    const item = this.items.id(itemId);
    if (!item) {
        throw new Error('Item not found in cart');
    }

    item.quantity = newQuantity;
    return this.save();
};

// Instance method to remove item from cart
cartSchema.methods.removeItem = function(itemId) {
    this.items = this.items.filter(item => item._id.toString() !== itemId.toString());
    return this.save();
};

// Instance method to clear entire cart
cartSchema.methods.clearCart = function() {
    this.items = [];
    return this.save();
};

// Instance method to check if product exists in cart
cartSchema.methods.hasProduct = function(productId) {
    return this.items.some(item => item.product.toString() === productId.toString());
};

// Instance method to get item by product ID
cartSchema.methods.getItemByProductId = function(productId) {
    return this.items.find(item => item.product.toString() === productId.toString());
};

// Instance method to validate stock availability
cartSchema.methods.validateStock = async function() {
    const Product = mongoose.model('Product');
    const errors = [];

    for (const item of this.items) {
        const product = await Product.findById(item.product);
        if (!product) {
            errors.push(`Product ${item.product} not found`);
            continue;
        }

        if (!product.isAvailable) {
            errors.push(`Product "${product.name}" is not available`);
            continue;
        }

        if (product.stock < item.quantity) {
            errors.push(`Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}`);
        }
    }

    return errors;
};

// Static method to find or create cart for user
cartSchema.statics.findOrCreate = async function(userId) {
    let cart = await this.findOne({ user: userId });

    if (!cart) {
        cart = await this.create({ user: userId, items: [] });
    }

    return cart;
};

// Static method to get cart with populated products
cartSchema.statics.getCartWithDetails = async function(userId) {
    return await this.findOne({ user: userId })
        .populate({
            path: 'items.product',
            select: 'name images price stock farmName isAvailable category unit isOrganic',
            match: { isAvailable: true } // Only populate available products
        })
        .exec();
};

// Static method to merge carts (useful for guest to user conversion)
cartSchema.statics.mergeCarts = async function(sourceCartId, targetCartId) {
    const sourceCart = await this.findById(sourceCartId);
    const targetCart = await this.findById(targetCartId);

    if (!sourceCart || !targetCart) {
        throw new Error('One or both carts not found');
    }

    for (const sourceItem of sourceCart.items) {
        const existingItemIndex = targetCart.items.findIndex(
            item => item.product.toString() === sourceItem.product.toString()
        );

        if (existingItemIndex > -1) {
            // Merge quantities
            targetCart.items[existingItemIndex].quantity += sourceItem.quantity;
        } else {
            // Add new item
            targetCart.items.push({
                product: sourceItem.product,
                quantity: sourceItem.quantity,
                price: sourceItem.price
            });
        }
    }

    await targetCart.save();
    await sourceCart.clearCart(); // Clear the source cart after merge

    return targetCart;
};

// Index for better performance
cartSchema.index({ user: 1 });
cartSchema.index({ 'lastUpdated': 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 }); // Auto-delete after 30 days

// Export the model
module.exports = mongoose.model('Cart', cartSchema);