import { useState, useCallback } from "react";
import axios from "../api/axios";

/**
 * useApi Custom Hook
 * Standardizes fetching logic, loading states, and error handling.
 */
export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const request = useCallback(async (method, url, data = null) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios({
        method,
        url,
        data,
      });
      setSuccess(response.data.message || "Action successful!");
      setLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || "An unexpected error occurred.";
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, []);

  return { request, loading, error, success, setError, setSuccess };
}
