---
nav:
  title: Hooks
  path: /hooks

group:
  title: common
  path: /common
---

# useControlledValue

用于管理组件的受控与非受控状态

## Examples

<!-- ```tsx
import React from 'react';
import { useControlledValue } from '@shihengtech/hooks';

type Props = {
  value?: string;
  defaultValue?: string;
  onChange?(value: string): void;
}

export default ((props) => {
  const [value, setValue] = useControlledValue(props);

  return <input value={value} onChange={e => setValue(e.target.value, value)}  />
}) as React.FC<Props>

``` -->

## API

```typescript
type OptionsType<T> = {
  defaultValue?: T;
  /**
   * @default "defaultValue"
   */
  defaultValueName?: string;
  valueName?: string;
  onChangeName?: string;
};

useControlledValue<T>(props: Record<string, any>, options: OptionsType<T>): [T, (value: T, ...rest: any[]) => void];
```
