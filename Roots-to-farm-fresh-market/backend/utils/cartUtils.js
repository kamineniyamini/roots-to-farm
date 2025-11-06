const Cart = require('../models/Cart');
const Product = require('../models/Product');

class CartUtils {
    // Add item to cart with stock validation
    static async addToCart(userId, productId, quantity = 1) {
        try {
            // Validate product exists and is available
            const product = await Product.findById(productId);
            if (!product) {
                throw new Error('Product not found');
            }

            if (!product.isAvailable) {
                throw new Error('Product is not available');
            }

            if (product.stock < quantity) {
                throw new Error(`Insufficient stock. Only ${product.stock} available`);
            }

            // Get or create cart for user
            const cart = await Cart.findOrCreate(userId);

            // Check if product already in cart
            const existingItem = cart.getItemByProductId(productId);
            const newTotalQuantity = existingItem ? existingItem.quantity + quantity : quantity;

            if (product.stock < newTotalQuantity) {
                throw new Error(`Insufficient stock. Cannot add ${quantity} more. Total would be ${newTotalQuantity} but only ${product.stock} available`);
            }

            // Add item to cart
            await cart.addItem(productId, quantity, product.price);

            return await Cart.getCartWithDetails(userId);
        } catch (error) {
            throw error;
        }
    }

    // Update cart item quantity with validation
    static async updateCartItem(userId, itemId, newQuantity) {
        try {
            if (newQuantity < 1) {
                throw new Error('Quantity must be at least 1');
            }

            const cart = await Cart.findOne({ user: userId });
            if (!cart) {
                throw new Error('Cart not found');
            }

            const item = cart.items.id(itemId);
            if (!item) {
                throw new Error('Item not found in cart');
            }

            // Validate stock
            const product = await Product.findById(item.product);
            if (!product) {
                throw new Error('Product not found');
            }

            if (product.stock < newQuantity) {
                throw new Error(`Insufficient stock. Only ${product.stock} available`);
            }

            await cart.updateItemQuantity(itemId, newQuantity);
            return await Cart.getCartWithDetails(userId);
        } catch (error) {
            throw error;
        }
    }

    // Remove item from cart
    static async removeFromCart(userId, itemId) {
        try {
            const cart = await Cart.findOne({ user: userId });
            if (!cart) {
                throw new Error('Cart not found');
            }

            await cart.removeItem(itemId);
            return await Cart.getCartWithDetails(userId);
        } catch (error) {
            throw error;
        }
    }

    // Clear entire cart
    static async clearCart(userId) {
        try {
            const cart = await Cart.findOne({ user: userId });
            if (!cart) {
                throw new Error('Cart not found');
            }

            await cart.clearCart();
            return await Cart.getCartWithDetails(userId);
        } catch (error) {
            throw error;
        }
    }

    // Get cart summary (for navbar count, etc.)
    static async getCartSummary(userId) {
        try {
            const cart = await Cart.findOne({ user: userId });
            if (!cart || cart.items.length === 0) {
                return {
                    totalItems: 0,
                    totalAmount: 0,
                    isEmpty: true
                };
            }

            return {
                totalItems: cart.totalItems,
                totalAmount: cart.totalAmount,
                isEmpty: false,
                itemCount: cart.items.length
            };
        } catch (error) {
            console.error('Error getting cart summary:', error);
            return {
                totalItems: 0,
                totalAmount: 0,
                isEmpty: true
            };
        }
    }

    // Validate entire cart before checkout
    static async validateCartForCheckout(userId) {
        try {
            const cart = await Cart.getCartWithDetails(userId);
            if (!cart || cart.items.length === 0) {
                throw new Error('Cart is empty');
            }

            const errors = await cart.validateStock();
            if (errors.length > 0) {
                throw new Error(errors.join(', '));
            }

            return {
                isValid: true,
                cart: cart,
                totalAmount: cart.totalAmount,
                totalItems: cart.totalItems
            };
        } catch (error) {
            return {
                isValid: false,
                error: error.message,
                cart: null
            };
        }
    }

    // Transfer guest cart to user cart (for login/registration)
    static async transferGuestCart(guestCartId, userId) {
        try {
            const userCart = await Cart.findOrCreate(userId);

            if (guestCartId) {
                const guestCart = await Cart.findById(guestCartId);
                if (guestCart && guestCart.items.length > 0) {
                    // Merge guest cart into user cart
                    for (const guestItem of guestCart.items) {
                        const existingItem = userCart.getItemByProductId(guestItem.product);

                        if (existingItem) {
                            // Update quantity if item exists
                            await userCart.updateItemQuantity(
                                existingItem._id,
                                existingItem.quantity + guestItem.quantity
                            );
                        } else {
                            // Add new item
                            await userCart.addItem(
                                guestItem.product,
                                guestItem.quantity,
                                guestItem.price
                            );
                        }
                    }

                    // Clear guest cart after transfer
                    await guestCart.clearCart();
                }
            }

            return await Cart.getCartWithDetails(userId);
        } catch (error) {
            console.error('Error transferring guest cart:', error);
            // Return user cart even if transfer fails
            return await Cart.getCartWithDetails(userId);
        }
    }
}

module.exports = CartUtils;