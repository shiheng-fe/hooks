import { useRef, useEffect, DependencyList, useCallback } from 'react';

function useEventCallback(fn: (...args: any[]) => any, dependencies: DependencyList) {
  const ref = useRef<Function>(() => {
    throw new Error('Cannot call an event handler while rendering.');
  });

  useEffect(() => {
    ref.current = fn;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fn, ...dependencies]);

  return useCallback(
    (...args: any[]) => {
      const fn = ref.current;
      return fn(...args);
    },
    [ref],
  );
}

export default useEventCallback;
