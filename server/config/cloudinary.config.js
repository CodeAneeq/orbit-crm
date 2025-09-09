import cloudinary from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import Constants from '../constant.js';

const cloudinaryV2 = cloudinary.v2;

cloudinaryV2.config({
  cloud_name: Constants.CLOUD_NAME,
  api_key: Constants.API_KEY,
  api_secret: Constants.API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryV2,
  params: async (req, file) => {
    let resource_type = 'image'; // default
    const originalname = file.originalname.replace(/\.[^/.]+$/, "");

    // Agar PDF hai to raw set karo
    if (file.mimetype === 'application/pdf') {
      return {
        folder: 'orbit_crm',
        public_id: originalname,
        resource_type: 'raw',  // Yeh important hai for non-image files
        format: 'pdf',
        type: 'upload'
      };
    } else {
      return {
        folder: 'orbit_crm',
        resource_type: "image",        // image ya raw
        allowedFormats: ['jpg', 'png', 'jpeg', 'gif', 'webp', 'pdf'],
      };
    }
  },
});

export { cloudinaryV2 as cloudinary, storage };
