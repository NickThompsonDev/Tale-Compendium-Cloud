import axios from 'axios';

export interface IApiClient {
  setAuthToken: (token: string | null) => void;
  clearAuth: () => void;
}

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};

export const clearAuth = () => {
  delete axiosInstance.defaults.headers.common['Authorization'];
};

// Export an API client interface to implement IApiClient
export const apiClient: IApiClient = {
  setAuthToken,
  clearAuth,
};

export default axiosInstance;
