/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from 'react';
import { AxiosError } from 'axios';

// Define the expected structure of error responses
interface ErrorResponse {
  message?: string; // Optional message field for error details
  [key: string]: unknown; // Allow additional fields in the error response
}

interface UseDataOptions<T> {
  fetchFn: () => Promise<T>;
  onSuccess?: (data: T) => void;
  onError?: (error: AxiosError<ErrorResponse>) => void;
  dependencies?: unknown[]; // Dependencies for the effect
}

export function useData<T>({
  fetchFn,
  onSuccess,
  onError,
  dependencies = [],
}: UseDataOptions<T>) {
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
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred.';
      setError(errorMessage);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [fetchFn, onSuccess, onError, ...(dependencies || [])]);

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Depend only on fetchData

  return { data, loading, error, refetch: fetchData };
}
