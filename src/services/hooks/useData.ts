import { useState, useEffect, useCallback } from 'react';
import { AxiosError } from 'axios';

interface UseDataOptions<T> {
  fetchFn: () => Promise<T>;
  onSuccess?: (data: T) => void;
  onError?: (error: AxiosError) => void;
  dependencies?: unknown[];
}

type ErrorResponse = {
  message?: string;
};

export function useData<T>({ fetchFn, onSuccess, onError, dependencies = [] }: UseDataOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFn();
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
      setError(errorMessage);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [fetchFn, onError, onSuccess]);

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData, ...(dependencies || [])]); // Flatten dependencies array

  return { data, loading, error, refetch: fetchData };
}
