import { useEffect, useState } from 'react';

export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay || 500);

    return () => clearTimeout(timeoutId);
  }, [value, delay]);
  return debouncedValue;
}
