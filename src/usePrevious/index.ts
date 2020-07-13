import { useRef, useEffect } from 'react';

type compareFunction<T> = (prev: T | undefined, next: T) => boolean;

const usePrevious = <T>(value: T, compare?: compareFunction<T>): T | undefined => {
  const prevRef = useRef<T>();

  useEffect(() => {
    if (!compare || !compare(prevRef.current, value)) return;

    prevRef.current = value;
  });

  return prevRef.current;
};

export default usePrevious;
