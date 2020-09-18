import { useState, useCallback } from 'react';

const delayRun = (fn: Function) => setTimeout(fn, 0);

function useLocalStorageState<T = undefined>(
  key: string,
): [T | undefined, React.Dispatch<React.SetStateAction<T>>];
function useLocalStorageState<T>(
  key: string,
  value: T,
): [T, React.Dispatch<React.SetStateAction<T>>];

function useLocalStorageState<T>(key: string, defaultValue?: T) {
  const [state, setState] = useState<T>(() => {
    try {
      const localValue = JSON.parse(localStorage.getItem(key)!);
      // eslint-disable-next-line no-void
      return [null, void 0].includes(localValue) ? defaultValue : localValue;
    } catch (_e) {
      return defaultValue;
    }
  });

  const updateState: typeof setState = useCallback(
    value => {
      const valueType = typeof value;
      if (valueType === 'function') {
        setState(v => {
          const nextValue = (value as (value: T) => T)(v);

          delayRun(() => localStorage.setItem(key, JSON.stringify(nextValue)));
          return nextValue;
        });
      } else if (valueType === 'undefined') {
        setState(value);
        delayRun(() => localStorage.removeItem(key));
      }

      setState(value);
      delayRun(() => localStorage.setItem(key, JSON.stringify(value)));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return [state, updateState];
}

export default useLocalStorageState;
