import axiosInstance from './axiosInstance';
import { User, CreateUserPayload, UpdateUserPayload } from './types';

export const createUser = async (userData: CreateUserPayload): Promise<User> => {
  try {
    const response = await axiosInstance.post<User>('/users', userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const getUser = async (user: User): Promise<User> => {
  try {
    const response = await axiosInstance.post<User>('/users/user', user);
    return response.data;
  } catch (error) {
    console.error('Error fetching or creating user:', error);
    throw error;
  }
};

export const getUserById = async (clerkId: string): Promise<User> => {
  try {
    const response = await axiosInstance.get<User>(`/users/${clerkId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

export const updateUser = async (clerkId: string, updateData: UpdateUserPayload): Promise<User> => {
  try {
    const response = await axiosInstance.patch<User>(`/users/${clerkId}`, updateData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUser = async (clerkId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/users/${clerkId}`);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const getTopUserByNPCCreationCount = async (): Promise<User[]> => {
  try {
    const response = await axiosInstance.get<User[]>('/users/top-users');
    return response.data;
  } catch (error) {
    console.error('Error fetching top creators:', error);
    throw error;
  }
};


export const consumeTokens = async ({ clerkId, tokens }: { clerkId: string; tokens: number }) => {
  try {
    const response = await axiosInstance.patch(`/users/consume-tokens/${clerkId}`, { tokens });
    return response.data;
  } catch (error) {
    console.error('Error consuming tokens:', error);
    throw error;
  }
};

export const addTokens = async (payload: { clerkId: string; tokens: number }) => {
  try {
    const response = await axiosInstance.post('/users/add-tokens', payload);
    return response.data;
  } catch (error) {
    console.error('Error adding tokens:', error);
    throw error;
  }
};


