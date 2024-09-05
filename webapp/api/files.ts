import axiosInstance from './axiosInstance';

export const getImageUrl = async (storageId: number) => {
  try {
    const imageUrl = `${process.env.NEXT_PUBLIC_WEBAPP_URL}/storage/${storageId}`;
    return imageUrl;
  } catch (error) {
    console.error('Error constructing image URL:', error);
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

    return response.data; // Returns the StorageEntity containing the file's ID and other details
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};
