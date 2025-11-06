const express = require('express');
const upload = require('../middleware/upload');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Upload single file
router.post('/single', auth, upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }

        res.json({
            success: true,
            file: {
                filename: req.file.filename,
                path: `/uploads/${req.file.filename}`,
                size: req.file.size,
                mimetype: req.file.mimetype
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Upload multiple files
router.post('/multiple', auth, upload.array('files', 10), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'Please upload files' });
        }

        const files = req.files.map(file => ({
            filename: file.filename,
            path: `/uploads/${file.filename}`,
            size: file.size,
            mimetype: file.mimetype
        }));

        res.json({
            success: true,
            files
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;