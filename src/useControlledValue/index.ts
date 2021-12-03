import { useState } from 'react';
import useImmutableFn from '../useImmutableFn';

export type OptionsType<T> = {
  /**
   * @default '-'
   * @description 默认值，优先级顺序 props.value > defaultValue > props.defaultValue
   */
  defaultValue?: T;
  /**
   * @default 'defaultValue'
   * @description 默认值所使用的属性名
   */
  defaultValueName?: string;
  /**
   * @default 'value'
   * @description 值所使用的属性名
   */
  valueName?: string;
  /**
   * @default 'onChange'
   * @description 值发生变化时调用的函数名
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

  const setMergedValue = useImmutableFn((value: T, ...rest: any[]) => {
    if (!controlled) {
      setInnerValue(value);
    }
    props[onChangeName] && props[onChangeName](value, ...rest);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  return [mergedValue, setMergedValue] as const;
}

export default useControlledValue;
