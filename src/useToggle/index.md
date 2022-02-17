---
nav:
  title: Hooks
  path: /hooks

group:
  title: common
  path: /common
---

<!-- TODO: 待补充 -->

# useToggle

利用 useToggle 去实现一个更加方便去控制 boolean 值的变化，返回的 toggle 是一个 setState 函数，也就是说使用这个函数会渲染组件。

## Examples

```tsx
import React from 'react';
import { Button } from 'antd';
import { useToggle } from '@shihengtech/hooks';

export default (() => {
  const [value, toggle] = useToggle(true);
  return (
    <>
      <Button onClick={() => toggle(!value)}>toggle</Button>
      {`value is ${value}`}
    </>
  );
}) as React.FC;
```

## API

```typescript
const [value, toggle] = useToggle(true);
```

### Params

| 参数         | 说明                        | 类型      | 默认值 |
| ------------ | --------------------------- | --------- | ------ |
| initialValue | 必填，返回的 value 的初始值 | `boolean` | -      |

### Result

| 参数   | 说明                                                                                                 | 类型                       |
| ------ | ---------------------------------------------------------------------------------------------------- | -------------------------- |
| value  | useToggle 用来控制的 value                                                                           | `boolean`                  |
| toggle | 第一个参数如果是 boolean 值，那么 value 会赋值为第一个参数，如果不是 boolean 值，那么 value 会取反。 | `(nextValue: any) => void` |
