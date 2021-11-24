import { useCallback, useState } from 'react';
import { delayRun, isFunction, Nullable } from '../utils';

type _Storage = Pick<Storage, 'setItem' | 'getItem' | 'removeItem'>;

export const createUseStorageState =
  (storage: Nullable<_Storage>) =>
  <T>(key: string, defaultValue?: T | (() => T)) => {
    const [state, setState] = useState<T>(() => {
      try {
        const localValue = JSON.parse(storage?.getItem(key)!);
        // eslint-disable-next-line no-void
        if (![null, void 0].includes(localValue)) return localValue;
      } catch (_e) {}

      return isFunction(defaultValue) ? defaultValue() : defaultValue;
    });

    const updateState: typeof setState = useCallback(
      (value) => {
        const valueType = typeof value;
        if (valueType === 'function') {
          setState((v) => {
            const nextValue = (value as (value: T) => T)(v);

            delayRun(() => storage?.setItem(key, JSON.stringify(nextValue)));
            return nextValue;
          });
          return;
        }

        if (valueType === 'undefined') {
          setState(value);
          delayRun(() => storage?.removeItem(key));
          return;
        }

        setState(value);
        delayRun(() => storage?.setItem(key, JSON.stringify(value)));
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [],
    );

    return [state, updateState] as const;
  };

export default createUseStorageState;
