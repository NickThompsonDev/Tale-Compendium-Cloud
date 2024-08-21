import axiosInstance from './axiosInstance';

export const createPaymentIntent = async (payload: { amount: number, currency: string }) => {
  try {
    const response = await axiosInstance.post('/stripe/create-payment-intent', payload);
    return response.data;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};
