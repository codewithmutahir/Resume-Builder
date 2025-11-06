// Cloudinary configuration
// These values should be set in your .env file
const cloudinaryConfig = {
  cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
  uploadPreset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET,
  apiKey: process.env.REACT_APP_CLOUDINARY_API_KEY,
};

// Check if Cloudinary is configured
const isCloudinaryConfigured = 
  cloudinaryConfig.cloudName && 
  cloudinaryConfig.cloudName !== 'your_cloud_name' &&
  cloudinaryConfig.uploadPreset && 
  cloudinaryConfig.uploadPreset !== 'your_upload_preset';

if (!isCloudinaryConfigured) {
  console.warn(
    'Cloudinary is not configured. Please set up Cloudinary environment variables in your .env file.\n' +
    'See CLOUDINARY_SETUP.md for instructions.'
  );
}

export { cloudinaryConfig, isCloudinaryConfigured };

