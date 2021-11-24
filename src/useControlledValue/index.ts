import { useState, useCallback } from 'react';

export type OptionsType<T> = {
  defaultValue?: T;
  /**
   * @default 'defaultValue'
   */
  defaultValueName?: string;
  /**
   * @default 'value'
   */
  valueName?: string;
  /**
   * @default 'onChange'
   */
  onChangeName?: string;
};

function useControlledValue<T = any>(
  props: { [key: string]: any },
  options: OptionsType<T> = {},
) {
  const {
    defaultValue,
    defaultValueName = 'defaultValue',
    valueName = 'value',
    onChangeName = 'onChange',
  } = options;

  const controlled = valueName in props;

  const [innerValue, setInnerValue] = useState<T>(() => {
    if (controlled) return props[valueName];

    return defaultValue ?? props[defaultValueName];
  });
  const mergedValue: T = controlled ? props[valueName] : innerValue;

  const setMergedValue = useCallback((value: T, ...rest: any[]) => {
    if (!controlled) {
      setInnerValue(value);
    }
    props[onChangeName] && props[onChangeName](value, ...rest);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [mergedValue, setMergedValue] as const;
}

export default useControlledValue;
