
import { useState, useEffect } from 'react';

/**
 * A hook that returns a debounced value.
 * The value will only update after the specified delay has passed without the value changing.
 * 
 * @param value The value to debounce
 * @param delay The delay in milliseconds
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set a timeout to update the debounced value after the delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clear the timeout if the value changes (or component unmounts)
    // This prevents the debounced value from updating if the user is still typing
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
