import { useEffect, useRef } from 'react';

export default function useDebounce(value, delay) {
  const debouncedValue = useRef(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      debouncedValue.current = value;
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue.current;
}
