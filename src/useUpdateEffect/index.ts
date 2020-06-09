import { useEffect, useRef } from 'react';

const useUpdateEffect: typeof useEffect = (effect, deps) => {
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return effect();

    mounted.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

export default useUpdateEffect;
