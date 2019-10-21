import { DependencyList, useState, useCallback } from 'react';
import { Unpacked } from '@/utils/type';

interface Options<T> {
  onSuccess?: (result: T) => void;
  onError?: (error: any) => void;
}

type useLoadingMiddleware<
  F extends (...args: any[]) => Promise<any> = (...args: any[]) => Promise<any>
> = (
  fn: F,
  options: Options<Unpacked<F>>,
  setLoading: React.Dispatch<React.SetStateAction<number>>,
) => (...args: Parameters<F>) => (() => void) | void;

export const takeLatest: useLoadingMiddleware = (fn, { onSuccess, onError }, setLoading) => {
  return (...args) => {
    let abort = false;

    setLoading(1);

    fn(...args)
      .then(result => {
        if (abort) return;
        setLoading(0);
        onSuccess && onSuccess(result);
      })
      .catch(error => {
        if (abort) return;
        setLoading(0);
        onError && onError(error);
      });

    return () => {
      abort = true;
    };
  };
};

export const all: useLoadingMiddleware = (fn, { onSuccess, onError }, setLoading) => {
  return (...args) => {
    setLoading(num => num + 1);

    fn(...args)
      .then(result => {
        setLoading(num => num - 1);
        onSuccess && onSuccess(result);
      })
      .catch(error => {
        setLoading(num => num - 1);
        onError && onError(error);
      });
  };
};

const useLoading = <F extends (...args: any[]) => Promise<any>>(
  fn: F,
  deps: DependencyList = [],
  options: Options<Unpacked<F>> = {},
  middleware: useLoadingMiddleware<F> = takeLatest,
) => {
  const [loading, setLoading] = useState(0);

  const run = useCallback(middleware(fn, options, setLoading), deps);

  return [!!loading, run] as const;
};

export default useLoading;
