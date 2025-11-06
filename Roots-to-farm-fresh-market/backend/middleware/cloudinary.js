const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'roots-to-farm',
        format: async(req, file) => 'png',
        public_id: (req, file) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            return file.fieldname + '-' + uniqueSuffix;
        },
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
});

// Utility function to delete images
const deleteImage = async(publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
    }
};

// In routes/products.js, replace multer import and usage:
const { upload } = require('../middleware/cloudinary');

// Update the create and update routes to use Cloudinary
router.post('/', farmerAuth, upload.array('images', 5), async(req, res) => {
    try {
        const productData = {
            ...req.body,
            farmer: req.user.id,
            farmName: req.body.farmName || req.user.name
        };

        if (req.files) {
            productData.images = req.files.map(file => file.path);
        }

        const product = await Product.create(productData);
        res.status(201).json({ success: true, product });
    } catch (error) {
        // Delete uploaded images if product creation fails
        if (req.files) {
            req.files.forEach(file => {
                cloudinary.uploader.destroy(file.filename);
            });
        }
        res.status(500).json({ message: error.message });
    }
});
module.exports = { upload, deleteImage, cloudinary };