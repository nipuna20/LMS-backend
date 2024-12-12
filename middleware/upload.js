const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Load environment variables
require("dotenv").config();

// Maximum file size (1MB)
const maxSize = 1 * 1024 * 1024;

// Upload directory (default: './uploads')
const destination = process.env.DESTINATION_UPLOAD || "./uploads";

// Ensure the upload directory exists
if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, destination); // Set destination directory
    },
    filename: (req, file, cb) => {
        const randomNumber = Math.floor(Math.random() * 1000); // Random number for uniqueness
        cb(
            null,
            `${file.fieldname}_${Date.now()}_${randomNumber}${path.extname(file.originalname)}` // Unique filename
        );
    },
});

// File type filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Accept file
    } else {
        cb(new Error("Only JPG, PNG, and PDF files are allowed!"), false); // Reject file
    }
};

// Multer configuration
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: maxSize }, // Set file size limit
});

// Export the configured upload middleware
module.exports = upload;
