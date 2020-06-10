import { useEffect, DependencyList } from 'react';
import useLoading, { IUseLoadingState } from '../useLoading';
import { PromiseReturnType } from '../utils';

type IUseFetchState<D> = {
  data?: D;
  error?: any;
};

export interface IUseFetchOptions<T extends (...args: any[]) => any> {
  initialState?: IUseFetchState<PromiseReturnType<T>>;
  onSuccess?: (
    result: PromiseReturnType<T>,
    params: Parameters<T>,
  ) => void | IUseFetchState<PromiseReturnType<T>>;
  onError?: (error: Error, params: Parameters<T>) => void | IUseFetchState<PromiseReturnType<T>>;
  auto?: boolean;
}

export default function useFetch<T extends (...args: any[]) => any>(
  func: T,
  deps: DependencyList = [],
  { auto = true, onError, onSuccess, initialState }: IUseFetchOptions<T> = {},
) {
  const result = useLoading<
    typeof func,
    IUseLoadingState<T> & IUseFetchState<PromiseReturnType<T>>
  >(
    func,
    setState => ({
      onSuccess: (data, params) => {
        if (onSuccess) {
          setState(s => ({ ...s, data, ...onSuccess(data, params) }));
          return;
        }
        setState(s => ({ ...s, data }));
      },
      onError: (error, params) => {
        if (onError) {
          setState(s => ({ ...s, error, ...onError(error, params) }));
          return;
        }
        setState(s => ({ ...s, error }));
      },
    }),
    initialState,
  );

  useEffect(() => {
    if (auto) {
      (result.run as () => void)();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return result;
}
