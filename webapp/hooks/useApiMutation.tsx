import { useState } from 'react';
import api from '@/api';

export const useApiMutation = (apiFunction: Function) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const mutate = async (data: any) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiFunction(data);
      setIsLoading(false);
      return response;
    } catch (err) {
      setError('An error occurred');
      setIsLoading(false);
      throw err;
    }
  };

  return { mutate, isLoading, error };
};
