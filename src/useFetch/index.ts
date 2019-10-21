import { DependencyList, useState, useEffect, useMemo } from 'react';
import useLoading from '@/useLoading';
import { Unpacked } from '@/utils/type';

interface UseFetchState<D> {
  data?: D;
  error?: any;
}

const useFetch = <F extends (...args: any[]) => Promise<any>>(
  fn: F,
  deps: DependencyList = [],
  options: {
    auto?: boolean; // 默认自动
    initialState?: UseFetchState<Unpacked<F>>;
    onSuccess?: (result: Unpacked<F>) => UseFetchState<Unpacked<F>> | void;
    onError?: (error: any) => UseFetchState<Unpacked<F>> | void;
  } = {},
) => {
  // options 的 initialState, auto 不允许修改
  const { initialState, auto = true } = useMemo(() => options, [options]);

  const [state, setState] = useState<UseFetchState<Unpacked<F>>>(() => initialState || {});

  const [loading, run] = useLoading(fn, deps, {
    onSuccess: result => {
      const { onSuccess } = options;
      if (onSuccess) {
        return setState(s => ({ ...s, ...onSuccess(result) }));
      }
      setState(s => ({ ...s, data: result }));
    },
    onError: error => {
      const { onError } = options;
      if (onError) {
        return setState(s => ({ ...s, ...onError(error) }));
      }
      setState(s => ({ ...s, error }));
    },
  });

  if (auto) {
    // 这里 auto 的值是固定的，所以 hooks 的数量不会发生变化，所以没事
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(run, deps);
  }

  return { ...state, loading, run };
};

export default useFetch;
