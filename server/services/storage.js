const cloudinary = require('cloudinary').v2;

const configured = !!process.env.CLOUDINARY_CLOUD_NAME && !!process.env.CLOUDINARY_API_KEY && !!process.env.CLOUDINARY_API_SECRET;

if (configured) {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true
    });
  } catch (err) {
    console.error('Cloudinary config error:', err.message);
  }
}

async function uploadImage(filePath, options = {}) {
  if (!configured) {
    console.warn('Cloudinary not configured. Skipping upload.');
    return { skipped: true };
  }
  try {
    const res = await cloudinary.uploader.upload(filePath, {
      folder: options.folder || 'localdevhub',
      use_filename: true,
      unique_filename: true,
      overwrite: false,
      ...options
    });
    return { ok: true, url: res.secure_url, public_id: res.public_id };
  } catch (error) {
    console.error('Cloudinary upload error:', error?.message || error);
    return { ok: false, error: error?.message || 'Unknown error' };
  }
}

module.exports = { uploadImage };


