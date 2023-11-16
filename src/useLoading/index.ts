import { useState, useMemo, useRef } from 'react';
import { PromiseReturnType } from '../_internal/utils';

export type IUseLoadingState<T extends (...args: any[]) => Promise<any>> = {
  loading: boolean;
  params?: Parameters<T>;
};

export type FinishedParams<T extends (...args: any[]) => Promise<any>> = [
  (
    | { successful: true; payload: PromiseReturnType<T> }
    | { successful: false; payload: Error }
  ),
  ...Parameters<T>
];

export type IUseLoadingOptions<T extends (...args: any[]) => Promise<any>> = {
  onSuccess?: (result: PromiseReturnType<T>, ...params: Parameters<T>) => void;
  onError?: (error: Error, ...params: Parameters<T>) => void;
  onFinished?: (...args: FinishedParams<T>) => void;
};

type FnsRef<T extends (...args: any[]) => Promise<any>> =
  IUseLoadingOptions<T> & {
    fn: T;
    cancel?(): void;
  };

export default function useLoading<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options?: IUseLoadingOptions<T>,
  initialState?: Partial<IUseLoadingState<T>>,
) {
  const [state, setState] = useState<IUseLoadingState<T>>({
    loading: false,
    ...initialState,
  } as any);

  const fnsRef = useRef<FnsRef<T>>({
    fn,
    ...options,
  });

  fnsRef.current = {
    cancel: fnsRef.current.cancel,
    fn,
    ...options,
  };

  const methods = useMemo(
    () => ({
      run: async (...args: Parameters<T>): Promise<ReturnType<T>> => {
        let abort = false;
        const { fn, cancel, onSuccess, onError, onFinished } = fnsRef.current!;
        cancel && cancel();
        fnsRef.current.cancel = () => (abort = true);

        setState((s) => ({ ...s, loading: true, params: args }));

        return fn(...args)
          .then((result) => {
            if (abort) return;
            onSuccess && onSuccess(result, ...args);
            setState((s) => ({ ...s, loading: false }));
            onFinished &&
              onFinished({ successful: true, payload: result }, ...args);
            return result;
          })
          .catch((error) => {
            if (abort) return;
            onError && onError(error, ...args);
            setState((s) => ({ ...s, loading: false }));
            onFinished &&
              onFinished({ successful: false, payload: error }, ...args);
            throw error;
          });
      },
      cancel: () => {
        const { cancel } = fnsRef.current;
        cancel && cancel();
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return {
    ...state,
    setState,
    ...methods,
  };
}
