import { useState } from 'react';
import { run, delayRun, isFunction, Nullable } from '../utils';
import useUpdateEffect from '../../useUpdateEffect';
import useImmutableFn from '../..//useImmutableFn';

type _Storage = Pick<Storage, 'setItem' | 'getItem' | 'removeItem'>;

type Options = Partial<{
  /**
   * @default async
   */
  mode: 'sync' | 'async';
}>;

export const createUseStorageState =
  (storage: Nullable<_Storage>) =>
  <T>(key: string, defaultValue?: T | (() => T), options?: Options) => {
    const initialize = () => {
      try {
        const localValue = JSON.parse(storage?.getItem(key)!);
        // eslint-disable-next-line no-void
        if (![null, void 0].includes(localValue)) return localValue;
      } catch (_e) {}

      return isFunction(defaultValue) ? defaultValue() : defaultValue;
    };

    const [state, setState] = useState<T>(initialize);

    useUpdateEffect(() => {
      initialize();
    }, [key]);

    const { mode } = { mode: 'async', ...options } as Required<Options>;

    const updateState: typeof setState = useImmutableFn((value) => {
      const nextValue = isFunction(value) ? value(state) : value;

      if (typeof nextValue === 'undefined') {
        setState(value);
        (mode === 'async' ? delayRun : run)(() => storage?.removeItem(key));
        return;
      }

      setState(nextValue);
      (mode === 'async' ? delayRun : run)(() =>
        storage?.setItem(key, JSON.stringify(value)),
      );
    });

    return [state, updateState] as const;
  };

export default createUseStorageState;
