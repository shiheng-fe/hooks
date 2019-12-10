import { useCallback, useState, useRef } from 'react';
import { Unpack, ArgsType } from '../utils';
import useEventCallback from '../useEventCallback';

export interface IUseLoadingOption<T extends (...args: any[]) => any> {
  onSuccess?: (result: Unpack<ReturnType<T>>, params: ArgsType<T>) => void;
  onError?: (error: Error, params: ArgsType<T>) => void;
}

export default function useLoading<T extends (...args: any[]) => any>(
  func: T,
  options: IUseLoadingOption<T> = {},
) {
  const [{ loading }, setState] = useState({ loading: false });
  const execCount = useRef(0);

  const params = useRef<ArgsType<T>>();

  const run = useEventCallback((...args: ArgsType<T>) => {
    execCount.current += 1;
    const runCount = execCount.current;
    params.current = args;
    setState(s => ({ ...s, loading: true }));

    return (async () => func(...args))()
      .then(result => {
        if (runCount === execCount.current) {
          if (options.onSuccess) {
            options.onSuccess(result, params.current as ArgsType<T>);
          }
        }
        if (runCount === execCount.current) {
          setState(s => ({ ...s, result, loading: false }));
        }
        return result;
      })
      .catch(error => {
        if (runCount === execCount.current) {
          if (options.onError) {
            options.onError(error, params.current as ArgsType<T>);
          }
          setState(s => ({ ...s, error, loading: false }));
        }
        return error;
      });
  }, []) as T;

  const cancel = useCallback(() => {
    execCount.current += 1;
    setState(s => ({ ...s, loading: false }));
  }, []);

  return {
    loading,
    params: params.current,
    run,
    cancel,
  } as const;
}
