// API service functions
const API_BASE_URL = 'http://localhost:5001/api';

// Helper function for API calls
const apiRequest = async(endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };

    // Add token to headers if available
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
};

// Auth API
export const authAPI = {
    register: (userData) =>
        apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        }),

    login: (credentials) =>
        apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        }),

    getProfile: () =>
        apiRequest('/auth/me'),

    updateProfile: (profileData) =>
        apiRequest('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData),
        }),
};

// Products API
export const productsAPI = {
    getAll: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/products?${queryString}`);
    },

    getById: (id) =>
        apiRequest(`/products/${id}`),

    create: (productData) =>
        apiRequest('/products', {
            method: 'POST',
            body: JSON.stringify(productData),
        }),

    update: (id, productData) =>
        apiRequest(`/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(productData),
        }),

    delete: (id) =>
        apiRequest(`/products/${id}`, {
            method: 'DELETE',
        }),

    addReview: (id, reviewData) =>
        apiRequest(`/products/${id}/reviews`, {
            method: 'POST',
            body: JSON.stringify(reviewData),
        }),
};

// Cart API
export const cartAPI = {
    get: () =>
        apiRequest('/cart'),

    addItem: (itemData) =>
        apiRequest('/cart/add', {
            method: 'POST',
            body: JSON.stringify(itemData),
        }),

    updateItem: (itemId, quantity) =>
        apiRequest(`/cart/update/${itemId}`, {
            method: 'PUT',
            body: JSON.stringify({ quantity }),
        }),

    removeItem: (itemId) =>
        apiRequest(`/cart/remove/${itemId}`, {
            method: 'DELETE',
        }),

    clear: () =>
        apiRequest('/cart/clear', {
            method: 'DELETE',
        }),
};

// Orders API
export const ordersAPI = {
    create: (orderData) =>
        apiRequest('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData),
        }),

    getMyOrders: () =>
        apiRequest('/orders/my-orders'),

    getById: (id) =>
        apiRequest(`/orders/${id}`),

    updateStatus: (id, status) =>
        apiRequest(`/orders/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ orderStatus: status }),
        }),

    cancel: (id) =>
        apiRequest(`/orders/${id}/cancel`, {
            method: 'PUT',
        }),
};

// Farmers API
export const farmersAPI = {
    getAll: () =>
        apiRequest('/farmers'),

    getById: (id) =>
        apiRequest(`/farmers/${id}`),

    createProfile: (profileData) =>
        apiRequest('/farmers/profile', {
            method: 'POST',
            body: JSON.stringify(profileData),
        }),

    updateProfile: (profileData) =>
        apiRequest('/farmers/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData),
        }),

    getProducts: (id) =>
        apiRequest(`/farmers/${id}/products`),

    getDashboardStats: () =>
        apiRequest('/farmers/dashboard/stats'),
};

// Upload API
export const uploadAPI = {
    single: (file) => {
        const formData = new FormData();
        formData.append('file', file);

        return apiRequest('/upload/single', {
            method: 'POST',
            // Remove Content-Type header for FormData - let browser set it
            headers: {},
            body: formData,
        });
    },

    multiple: (files) => {
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));

        return apiRequest('/upload/multiple', {
            method: 'POST',
            // Remove Content-Type header for FormData - let browser set it
            headers: {},
            body: formData,
        });
    },
};

// Payment API
export const paymentAPI = {
    createPaymentIntent: (orderId) =>
        apiRequest('/payment/create-payment-intent', {
            method: 'POST',
            body: JSON.stringify({ orderId }),
        }),
};

// Default export
export default {
    authAPI,
    productsAPI,
    cartAPI,
    ordersAPI,
    farmersAPI,
    uploadAPI,
    paymentAPI,
};