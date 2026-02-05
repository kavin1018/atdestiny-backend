import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import { config } from './app.config.js';
import { BadRequestException } from '../exceptions/index.js';

cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (_req, file) => {
        const folder = file.mimetype.startsWith('video') ? 'atdestiny/videos' : 'atdestiny/images';
        return {
            folder: folder,
            resource_type: 'auto',
            allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'gif', 'mp4', 'webm'],
            public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
        };
    },
});

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimeTypes = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
        'video/mp4',
        'video/webm',
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new BadRequestException('Invalid file type. Only images and videos are allowed.'));
    }
};

export const cloudinaryUpload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB for Cloudinary (can handle larger than local)
    },
});

export { cloudinary };
