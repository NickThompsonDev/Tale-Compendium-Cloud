import axiosInstance from './axiosInstance';

export const generateThumbnail = async (prompt: string) => {
    try {
        const response = await axiosInstance.post('/openai/generate-thumbnail', { prompt });
        return response.data; // Assuming the response contains the image data
    } catch (error) {
        console.error('Error generating thumbnail:', error);
        throw error;
    }
};

export const generateNPCDetails = async (payload: { input: string }) => {
    try {
      const response = await axiosInstance.post('/openai/generate-npc-details', payload);
      return response.data;
    } catch (error) {
      console.error('Error generating NPC details:', error);
      throw error;
    }
  };

