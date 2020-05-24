import { useRef } from 'react';

const useImmutable = <D = any>(val: D) => {
  const r = useRef<D>(val);

  r.current = val;
  // useEffect(() => {
  //   r.current = val;
  // });

  return r;
};

export default useImmutable;
