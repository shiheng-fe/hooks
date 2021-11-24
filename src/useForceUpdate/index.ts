import { useReducer } from 'react';

const useForceUpdate = () => {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  return forceUpdate as () => void;
};

export default useForceUpdate;
