const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    farmName: {
        type: String,
        required: true,
        trim: true
    },
    farmDescription: String,
    farmLocation: {
        address: String,
        city: String,
        state: String,
        zipCode: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    farmSize: {
        type: String,
        enum: ['small', 'medium', 'large']
    },
    farmingMethods: [{
        type: String,
        enum: ['organic', 'hydroponic', 'traditional', 'permaculture', 'greenhouse']
    }],
    certifications: [String],
    yearsOfExperience: Number,
    contactInfo: {
        phone: String,
        email: String,
        website: String
    },
    socialMedia: {
        facebook: String,
        instagram: String,
        twitter: String
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalSales: {
        type: Number,
        default: 0
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Farmer', farmerSchema);