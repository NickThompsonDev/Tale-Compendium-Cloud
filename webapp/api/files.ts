import axiosInstance from './axiosInstance';

// Retrieve image URL based on storage ID
export const getImageUrl = async (storageId: number) => {
  if (!storageId) {
    console.error("Invalid storage ID:", storageId);
    throw new Error('Storage ID is undefined or invalid.');
  }

  try {
    const response = await axiosInstance.get(`/storage/${storageId}`);
    return response.request.responseURL;
  } catch (error) {
    console.error('Error retrieving image URL:', error);
    throw error;
  }
};

// Upload the file and directly return the image URL from the backend response
export const uploadFile = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstance.post('/storage/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const { imageUrl } = response.data;
    console.log("uploadFile response", imageUrl);
    return imageUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};
