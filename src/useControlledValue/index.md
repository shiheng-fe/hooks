---
nav:
  path: /hooks
---

# useControlledValue

用于管理组件的受控与非受控状态

## Examples

```tsx
import React from 'react';
import { useControlledValue } from '@shihengtech/hooks';

type Props = {
  value?: string;
  defaultValue?: string;
  onChange?(value: string): void;
};

export default ((props) => {
  const [value, setValue] = useControlledValue(props);

  return <input value={value} onChange={(e) => setValue(e.target.value)} />;
}) as React.FC<Props>;
```

---

## Types

```typescript
type OptionsType<T> = {
  defaultValue?: T;
  defaultValueName?: string;
  valueName?: string;
  onChangeName?: string;
};

type Result<T> = [T, (value: T, ...rest: any[]) => void];

useControlledValue<T>(props: Record<string, any>, options?: OptionsType<T>): Result<T>;
```

---

## API

```typescript
const [state, setState] = useControlledValue(props: Record<string, any>, options?: Options)
```

### Params

| 参数    | 说明         | 类型                  | 默认值 |
| ------- | ------------ | --------------------- | ------ |
| props   | 组件的 props | `Record<string, any>` | -      |
| options | 配置项       | `OptionsType`         | -      |

### Options

| 参数             | 说明                                                                     | 类型     | 默认值         |
| ---------------- | ------------------------------------------------------------------------ | -------- | -------------- |
| defaultValue     | 默认值，优先级顺序 `props.value` > `defaultValue` > `props.defaultValue` | `any`    | -              |
| defaultValueName | 默认值所使用的属性名                                                     | `string` | `defaultValue` |
| valueName        | 值所使用的属性名                                                         | `string` | `value`        |
| onChangeName     | 值发生变化时调用的函数名                                                 | `string` | `onChange`     |

### Result

| 参数     | 说明           | 类型                                   |
| -------- | -------------- | -------------------------------------- |
| state    | 状态值         | `any`                                  |
| setState | 修改状态的函数 | `(value: any, ...rest: any[]) => void` |
