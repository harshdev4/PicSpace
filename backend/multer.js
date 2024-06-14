const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const sharp = require('sharp');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueFilename = uuidv4() + path.extname(file.originalname);
        cb(null, uniqueFilename);
    }
});

const upload = multer({ storage: storage });

// Middleware to resize images
const resizeImage = async (req, res, next) => {
    // Check if the file is an image
    if (!req.file || !req.file.mimetype.startsWith('image')) {
      return next();
    }
  
    try {
      // Resize the image if it's larger than 150kb
      const buffer = await sharp(req.file.buffer)
        .resize({ width: 800, height: 600 }) // Adjust dimensions as needed
        .maxFileSize(150 * 1024) // 150kb in bytes
        .toBuffer();
  
      // Update the file buffer with the resized image
      req.file.buffer = buffer;
    } catch (error) {
      // Log any errors and continue with the original image
      console.error('Error resizing image:', error);
    }
  
    next();
  };
  
  module.exports = { upload, resizeImage };
