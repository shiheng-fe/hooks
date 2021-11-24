import { useCallback } from 'react';
import { useImmutable } from '..';

const useImmutableFn = <T extends (...args: any[]) => any>(fn: T) => {
  const fnRef = useImmutable(fn);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(((...args) => fnRef.current(...args)) as T, []);
};

export default useImmutableFn;
