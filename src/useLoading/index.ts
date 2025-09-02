import { useState, useMemo, useRef, useCallback } from 'react';
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
  ...Parameters<T>,
];

export type IUseLoadingOptions<T extends (...args: any[]) => Promise<any>> = {
  onSuccess?: (result: PromiseReturnType<T>, ...params: Parameters<T>) => void;
  onError?: (error: Error, ...params: Parameters<T>) => void;
  onFinished?: (...args: FinishedParams<T>) => void;
  debounceWait?: number;
};

type FnsRef<T extends (...args: any[]) => Promise<any>> =
  IUseLoadingOptions<T> & {
    fn: T;
    debounceTimer?: NodeJS.Timeout | null;
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

  const executeRequest = useCallback(async (...args: Parameters<T>) => {
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
      })
      .catch((error) => {
        if (abort) return;
        onError && onError(error, ...args);
        setState((s) => ({ ...s, loading: false }));
        onFinished &&
          onFinished({ successful: false, payload: error }, ...args);
      });
  }, []);

  const methods = useMemo(
    () => ({
      run: (...args: Parameters<T>) => {
        const { debounceWait } = fnsRef.current;

        // 清除之前的防抖定时器
        if (fnsRef.current.debounceTimer) {
          clearTimeout(fnsRef.current.debounceTimer);
          fnsRef.current.debounceTimer = null;
        }

        // 如果设置了防抖时间，则延迟执行
        if (debounceWait && debounceWait > 0) {
          fnsRef.current.debounceTimer = setTimeout(() => {
            executeRequest(...args);
          }, debounceWait);
        } else {
          // 没有设置防抖时间，直接执行
          return executeRequest(...args);
        }
      },
      cancel: () => {
        // 取消防抖定时器
        if (fnsRef.current.debounceTimer) {
          clearTimeout(fnsRef.current.debounceTimer);
          fnsRef.current.debounceTimer = null;
        }

        const { cancel } = fnsRef.current;
        cancel && cancel();
      },
    }),
    [executeRequest],
  );

  return {
    ...state,
    setState,
    ...methods,
  };
}
