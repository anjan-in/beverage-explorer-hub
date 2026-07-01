import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number = 500): T {
  // State to store the debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 1. Set a timer to update the debounced value after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

  // 2. Cleanup function: This is the magic. 
  // If 'value' or 'delay' changes before the timeout finishes, 
  // React runs this cleanup, clearing the previous timer.
  return () => {
    clearTimeout(handler);
  };
}, [value, delay]); // Re-run the effect if value or delay changes

  return debouncedValue;
}