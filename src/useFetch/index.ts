import { useEffect, DependencyList, useCallback } from 'react';
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
          const extra = onSuccess(data, params);
          setState(s => ({ ...s, data, ...extra }));
          return;
        }
        setState(s => ({ ...s, data }));
      },
      onError: (error, params) => {
        if (onError) {
          const extra = onError(error, params);
          setState(s => ({ ...s, error, ...extra }));
          return;
        }
        setState(s => ({ ...s, error }));
      },
    }),
    initialState,
  );

  const setState = useCallback(
    (nextState =>
      result.setState(s => ({
        ...s,
        ...(typeof nextState === 'function' ? nextState(s) : nextState),
      }))) as React.Dispatch<React.SetStateAction<IUseFetchState<PromiseReturnType<T>>>>,
    [],
  );

  useEffect(() => {
    if (auto) {
      (result.run as () => void)();

      return result.cancel;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { ...result, setState };
}
