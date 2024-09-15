import axiosInstance from './axiosInstance';

// Retrieve image URL based on storage ID
export const getImageUrl = async (storageId: number) => {
  try {
    const response = await axiosInstance.get(`/storage/${storageId}`);
    const imageUrl = response.request.responseURL; // The final redirect URL after following all redirects
    console.log("getImageUrl", imageUrl); // Log to check the correct URL
    return imageUrl;
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

    const { imageUrl } = response.data; // Backend should return the imageUrl directly
    console.log("uploadFile response", imageUrl); // Log to check if the correct image URL is returned
    return imageUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};
