import { useState, useEffect, useCallback } from 'react';

export const useApiQuery = (
  apiFunction: (...args: any[]) => Promise<any>,
  params: any[]
) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  const serializedParams = JSON.stringify(params);

  const fetchData = useCallback(async () => {
    if (error) return; // Skip fetching if there's already an error
    setIsLoading(true);
    setError(null); // Reset error state on new fetch attempt
    try {
      const response = await apiFunction(serializedParams);
      setData(response);
    } catch (err) {
      setError('An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [apiFunction, serializedParams, error]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error };
};
