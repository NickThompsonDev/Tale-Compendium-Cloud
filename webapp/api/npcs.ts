// api/npcApi.ts
import { NPCProps } from '@/types';
import axiosInstance from './axiosInstance';

export const createNPC = async (npcData: any) => {
  try {
    const response = await axiosInstance.post('/npcs', npcData);
    return response.data;
  } catch (error) {
    console.error('Error creating NPC:', error);
    throw error;
  }
};

export const getAllNPCs = async () => {
  try {
    const response = await axiosInstance.get('/npcs');
    return response.data;
  } catch (error) {
    console.error('Error fetching NPCs:', error);
    throw error;
  }
};

export const getNPCById = async (npcId: any) => {
  try {
    const response = await axiosInstance.get(`/npcs/${npcId}`);
    console.log('response', response.data)
    return response.data;
  } catch (error) {
    console.error('Error fetching NPC:', error);
    throw error;
  }
};

export const getNPCBySearch = async (search: string) => {
  try {
    const response = await axiosInstance.get(`/npcs/search`, { params: { search } });
    return response.data;
  } catch (error) {
    console.error('Error fetching NPCs:', error);
    throw error;
  }
};

export const getTrendingNPCs = async () => {
  console.log('Attempting to fetch trending NPCs...');
  try {
    const response = await axiosInstance.get<NPCProps[]>('/npcs/trending');
    console.log('API call successful, response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching trending NPCs:', error);
    throw error;
  }
};

export const updateNpcViews = async (npcId: any) => {
  try {
    const response = await axiosInstance.patch(`/npcs/update-views/${npcId}`);
    return response.data;
  } catch (error) {
    console.error('Error updating NPC views:', error);
    throw error;
  }
};

export const deleteNPC = async (npcId: any) => {
  try {
    const response = await axiosInstance.delete(`/npcs/${npcId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting NPC:', error);
    throw error;
  }
};

export const getNPCByAuthorId = async (authorId: string) => {
  try {
    const response = await axiosInstance.get(`/npcs/author/${authorId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching NPCs by author:', error);
    throw error;
  }
};

export function getUrl(getUrl: any) {
  throw new Error('Function not implemented.');
}

