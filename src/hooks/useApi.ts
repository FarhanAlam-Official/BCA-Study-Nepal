/**
 * Custom hook for making API requests using axios.
 * Provides a simple interface for handling data fetching, loading states, and errors.
 */

import { useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import api from '../api/core/api.core';

/**
 * Interface defining the options for the useApi hook
 * @template T The expected type of the API response data
 */
interface UseApiOptions<T> {
  /** Callback function to be executed when the API request is successful */
  onSuccess?: (data: T) => void;
  /** Callback function to be executed when the API request fails */
  onError?: (error: AxiosError) => void;
}

/**
 * A custom hook for handling API requests with built-in state management
 * @template T The expected type of the API response data
 * @param url The endpoint URL to fetch data from
 * @param options Optional configuration object for success and error callbacks
 * @returns Object containing the request state: data, loading status, and error if any
 */
export const useApi = <T>(url: string, options: UseApiOptions<T> = {}) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AxiosError | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(url);
        setData(response.data);
        options.onSuccess?.(response.data);
      } catch (err) {
        const error = err as AxiosError;
        setError(error);
        options.onError?.(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, options]);

  return { data, loading, error };
};