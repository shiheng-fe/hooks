import { useState, useRef, useMemo } from 'react';
import { PromiseReturnType } from '../utils';

export type IUseLoadingState<T extends (...args: any[]) => Promise<any>> = {
  loading: boolean;
  params?: Parameters<T>;
};

type IUseLoadingOption<T extends (...args: any[]) => Promise<any>> = {
  onSuccess?: (result: PromiseReturnType<T>, params: Parameters<T>) => void;
  onError?: (error: Error, params: Parameters<T>) => void;
};

export default function useLoading<
  T extends (...args: any[]) => Promise<any>,
  S extends IUseLoadingState<T>
>(
  fn: T,
  options:
    | IUseLoadingOption<T>
    | ((setState: React.Dispatch<React.SetStateAction<S>>) => IUseLoadingOption<T>) = {},
  initialState?: Partial<S>,
) {
  const [state, setState] = useState<S>({ loading: false, ...initialState } as any);

  const fnsRef = useRef<
    IUseLoadingOption<T> & {
      cancel: () => void;
      fn: T;
    }
  >({ fn, cancel: () => {} });
  fnsRef.current = {
    ...fnsRef.current,
    fn,
    ...(typeof options === 'function' ? options(setState) : options),
  };

  const { run, cancel } = useMemo(
    () => ({
      run: (...args: Parameters<T>) => {
        let abort = false;
        const { fn, cancel, onSuccess, onError } = fnsRef.current!;
        cancel();

        setState(s => ({ ...s, loading: true, params: args }));

        fn(...args)
          .then(result => {
            if (abort) return;
            onSuccess && onSuccess(result, args);
            setState(s => ({ ...s, loading: false }));
          })
          .catch(error => {
            if (abort) return;
            onError && onError(error, args);
            setState(s => ({ ...s, loading: false }));
          });

        fnsRef.current.cancel = () => (abort = true);
      },
      cancel: () => fnsRef.current.cancel(),
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
