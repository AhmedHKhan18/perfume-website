import axios from 'axios';

const cloudName = 'doo8r5y0m';
const uploadPreset = 'testers';

export const uploadToCloudinary = async (imageUri) => {
  const formData = new FormData();
  formData.append('file', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'image.jpg',
  });
  formData.append('upload_preset', uploadPreset);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
      formData
    );
    console.log('Upload successful:', response.data);
    return response.data.secure_url;
  } catch (error) {
    console.error('Error uploading image:', error.response ? error.response.data : error.message);
    return null;
  }
};

export const uploadMultipleToCloudinary = async (images) => {
  // images is an array of image files
  const uploadPromises = images.map(image => uploadToCloudinary(image));
  const imageUrls = await Promise.all(uploadPromises); // Wait for all uploads
  return imageUrls; // Returns an array of image URLs
};