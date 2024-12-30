import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

// Cloudinary Storage
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'uploads',
        format: async () => 'png', // Convert to PNG
        transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }],
    },
});

const upload = multer({ storage });


export default upload;
