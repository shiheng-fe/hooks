import { DependencyList, useState, useEffect, useCallback, useMemo } from 'react';

interface Options<T> {
  onSuccess: (result: T) => void;
  onError: (error: any) => void;
}

/**
 * TODO: 抽出去反正一个文件里。。。放哪里好呢
 */
type useLoadingMiddleware<T = any> = (
  fn: (...args: any[]) => Promise<T>,
  options: Options<T>,
  setLoading: React.Dispatch<React.SetStateAction<number>>,
) => (...args: Parameters<typeof fn>) => (() => void) | void;

export const takeLatest: useLoadingMiddleware = (fn, { onSuccess, onError }, setLoading) => {
  return (...args) => {
    let abort = false;

    setLoading(1);

    fn(...args)
      .then(result => {
        if (abort) return;
        setLoading(0);
        onSuccess(result);
      })
      .catch(error => {
        if (abort) return;
        setLoading(0);
        onError(error);
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
        onSuccess(result);
      })
      .catch(error => {
        setLoading(num => num - 1);
        onError(error);
      });
  };
};

export const debounce: useLoadingMiddleware = (fn, { onSuccess, onError }, setLoading) => {
  return () => {
    // TODO:
    console.log(fn, onSuccess, onError, setLoading);
  };
};

export const throttle: useLoadingMiddleware = (fn, { onSuccess, onError }, setLoading) => {
  return () => {
    // TODO:
    console.log(fn, onSuccess, onError, setLoading);
  };
};

export const useLoading = <F extends (...args: any[]) => Promise<any>>(
  fn: F,
  deps: DependencyList = [],
  options: Options<ReturnType<F>>,
  middleware: useLoadingMiddleware<ReturnType<F>> = takeLatest,
) => {
  const [loading, setLoading] = useState(0);

  const run = useCallback(middleware(fn, options, setLoading), deps);

  return [!!loading, run] as const;
};

interface UseAsyncState<D> {
  data?: D;
  error?: any;
}

export const useAsync = <F extends (...args: any[]) => Promise<any>, D = ReturnType<F>>(
  fn: F,
  deps: DependencyList = [],
  options: {
    auto?: boolean; // 默认自动
    initialState?: UseAsyncState<D>;
    onSuccess?: (result: ReturnType<F>) => UseAsyncState<D> | void;
    onError?: (error: any) => UseAsyncState<D> | void;
  } = {},
) => {
  // options 不允许修改
  const { initialState, onSuccess, onError, auto = true } = useMemo(() => options, [options]);

  const [state, setState] = useState<UseAsyncState<D>>(() => initialState || {});

  const [loading, run] = useLoading(fn, deps, {
    onSuccess: result => {
      if (onSuccess) {
        return setState(s => ({ ...s, ...onSuccess(result) }));
      }
      setState(s => ({ ...s, data: result as D }));
    },
    onError: error => {
      if (onError) {
        return setState(s => ({ ...s, ...onError(error) }));
      }
      setState(s => ({ ...s, error }));
    },
  });

  if (auto) {
    // 这里 auto 的值是固定的，所以 hooks 的数量不会发生变化，所以没事
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(run, deps);
  }

  return { ...state, loading, run };
};
