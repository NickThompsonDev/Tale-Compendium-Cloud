import axiosInstance from './axiosInstance';

export const getImageUrl = async (storageId: number) => {
  try {
    // Directly use the backend API to get the image URL by storage ID
    const response = await axiosInstance.get(`/storage/${storageId}`);
    const imageUrl = response.request.responseURL; // The final redirect URL
    return imageUrl;
  } catch (error) {
    console.error('Error retrieving image URL:', error);
    throw error;
  }
};

export const uploadFile = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstance.post('/storage/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Directly return the image URL from the backend response
    return response.data.imageUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};
