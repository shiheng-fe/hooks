import useImmutable from '@/useImmutable';
import { useState, useMemo } from 'react';
import { PromiseReturnType } from '@/_internal/utils';

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

export default function useLoading<
  T extends (...args: any[]) => Promise<any>,
  S extends IUseLoadingState<T>,
>(fn: T, options: IUseLoadingOptions<T>, initialState?: Partial<S>) {
  const [state, setState] = useState<S>({
    loading: false,
    ...initialState,
  } as any);

  const fnsRef = useImmutable<
    IUseLoadingOptions<T> & {
      fn: T;
      cancel?(): void;
    }
  >({
    fn,
    ...options,
  });

  const { run, cancel } = useMemo(
    () => ({
      run: (...args: Parameters<T>) => {
        let abort = false;
        const { fn, cancel, onSuccess, onError, onFinished } = fnsRef.current!;
        cancel && cancel();

        setState((s) => ({ ...s, loading: true, params: args }));

        fn(...args)
          .then((result) => {
            if (abort) return;
            onSuccess && onSuccess(result, ...args);
            setState((s) => ({ ...s, loading: false }));
            onFinished &&
              onFinished({ successful: true, payload: result }, ...args);
          })
          .catch((error) => {
            if (abort) return;
            onError && onError(error, ...args);
            setState((s) => ({ ...s, loading: false }));
            onFinished &&
              onFinished({ successful: false, payload: error }, ...args);
          });

        fnsRef.current.cancel = () => (abort = true);
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
    run,
    cancel,
  };
}
