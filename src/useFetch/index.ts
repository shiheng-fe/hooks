import { useEffect, DependencyList } from 'react';
import useLoading, { IUseLoadingState } from '../useLoading';
import { PromiseReturnType } from '@/typeUtils';

type IUseFetchState<D> = {
  data?: D;
  error?: any;
};

export interface IUseFetchOptions<T extends (...args: any[]) => any, D = PromiseReturnType<T>> {
  initialState?: IUseFetchState<D>;
  onSuccess?: (result: D, params: Parameters<T>) => void | IUseFetchState<D>;
  onError?: (error: Error, params: Parameters<T>) => void | IUseFetchState<D>;
  auto?: boolean;
}

export default function useFetch<
  T extends (...args: any[]) => any,
  D extends PromiseReturnType<T> = PromiseReturnType<T>
>(
  func: T,
  deps: DependencyList = [],
  { auto = true, onError, onSuccess, initialState }: IUseFetchOptions<T, D> = {},
) {
  const result = useLoading<typeof func, IUseLoadingState<T> & IUseFetchState<D>>(
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
      initialState,
    }),
  );

  useEffect(() => {
    if (auto) {
      (result.run as () => void)();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return result;
}
