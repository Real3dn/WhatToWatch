import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce rapid value updates (e.g., search text inputs)
 * @param {any} value - The input value to debounce
 * @param {number} delay - Debounce latency in milliseconds
 * @returns {any} Debounced value
 */
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
