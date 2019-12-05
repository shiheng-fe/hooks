import { useState, useEffect, DependencyList } from 'react';
import { Unpack, PromiseFunction, ArgsType, PromiseReturnType } from '../utils';
import useLoading from '../useLoading';

export interface IUseFetchState<D> {
  data?: D;
  error?: Error;
}

export interface IUseFetchOptions<T extends PromiseFunction> {
  initialState?: IUseFetchState<PromiseReturnType<T>>;
  onSuccess?: (
    result: PromiseReturnType<T>,
    params: ArgsType<T>,
  ) => void | IUseFetchState<PromiseReturnType<T>>;
  onError?: (error: Error, params: ArgsType<T>) => void | IUseFetchState<PromiseReturnType<T>>;
  auto?: boolean;
}

export default function useFetch<T extends PromiseFunction>(
  func: T,
  deps: DependencyList = [],
  { auto = true, onError, onSuccess, initialState }: IUseFetchOptions<T> = {},
) {
  const [state, setState] = useState<IUseFetchState<Unpack<ReturnType<T>>>>(
    () => initialState || {},
  );

  const { loading, run, cancel, params } = useLoading(func, {
    onSuccess: (data, params) => {
      if (onSuccess) {
        setState({ data, ...onSuccess(data, params) });
        return;
      }
      setState({ data });
    },
    onError: (error, params) => {
      if (onError) {
        setState(s => ({ ...s, error, ...onError(error, params) }));
        return;
      }
      setState(s => ({ ...s, error }));
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
