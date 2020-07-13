import { useCallback } from 'react';
import { useImmutable } from '..';

const useImmutableFunc = <T extends (...args: any[]) => any>(fn: T) => {
  const fnRef = useImmutable(fn);

  return useCallback(((...args) => fnRef.current(...args)) as T, []);
};

export default useImmutableFunc;
