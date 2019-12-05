import { useState, useEffect, DependencyList } from 'react';
import { Unpack } from '../utils';
import useLoading, { IUseLoadingOption } from '../useLoading';

export interface IUseFetchOptions<T extends (...args: any[]) => Promise<any>>
  extends IUseLoadingOption<T> {
  auto?: boolean;
}

export interface IUseFetchState<D> {
  data?: D;
  error?: Error;
}

export default function useFetch<T extends (...args: any[]) => Promise<any>>(
  func: T,
  deps: DependencyList = [],
  { auto = true, onError, onSuccess }: IUseFetchOptions<T> = {},
) {
  const [state, setState] = useState<IUseFetchState<Unpack<ReturnType<T>>>>({});

  const { loading, run, cancel, params } = useLoading(func, {
    onSuccess: (data, params) => {
      setState(s => ({ ...s, data }));
      if (onSuccess) {
        onSuccess(data, params);
      }
    },
    onError: (error, params) => {
      setState(s => ({ ...s, error }));
      if (onError) {
        onError(error, params);
      }
    },
  });

  useEffect(() => {
    if (auto) {
      run();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, run, ...deps]);

  return {
    ...state,
    loading,
    run,
    cancel,
    params,
  };
}
