import { useEffect, DependencyList, useState } from 'react';
import useLoading, { FinishedParams, IUseLoadingState } from '../useLoading';
import { isFunction, PromiseReturnType } from '../_internal/utils';

type IUseFetchState<D> = {
  data?: D;
  error?: any;
};

export interface IUseFetchOptions<T extends (...args: any[]) => any> {
  auto?: boolean;
  initialState?:
    | IUseFetchState<PromiseReturnType<T>>
    | (() => IUseFetchState<PromiseReturnType<T>>);
  onSuccess?: (
    result: PromiseReturnType<T>,
    ...params: Parameters<T>
  ) => void | IUseFetchState<PromiseReturnType<T>>;
  onError?: (
    error: Error,
    ...params: Parameters<T>
  ) => void | IUseFetchState<PromiseReturnType<T>>;
  onFinished?: (...args: FinishedParams<T>) => void;
  useCustomEffect?: typeof useEffect;
}

export default function useFetch<T extends (...args: any[]) => any>(
  func: T,
  deps: DependencyList = [],
  {
    auto = true,
    onError,
    onSuccess,
    onFinished,
    initialState,
    useCustomEffect = useEffect,
  }: IUseFetchOptions<T> = {},
) {
  const [state, setState] = useState(initialState);

  const result = useLoading<
    typeof func,
    IUseLoadingState<T> & IUseFetchState<PromiseReturnType<T>>
  >(func, {
    onSuccess: (data, ...params) => {
      if (onSuccess) {
        const sucResult = onSuccess(data, ...params);
        setState((s) => ({ ...s, data, ...sucResult }));
        return;
      }
      setState((s) => ({ ...s, data }));
    },
    onError: (error, ...params) => {
      if (onError) {
        const errResult = onError(error, ...params);
        setState((s) => ({ ...s, error, ...errResult }));
        return;
      }
      const _initialState = isFunction(initialState)
        ? initialState()
        : initialState;
      setState((s) => ({ ...s, ..._initialState, error }));
    },
    onFinished,
  });

  useCustomEffect(() => {
    if (auto) {
      (result.run as () => void)();

      return result.cancel;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { ...result, ...state, setState };
}
