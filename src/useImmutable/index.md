---
nav:
  path: /hooks
---

# useImmutable

`useEffect`、`useMemo` 等 **hook** 会产生一些闭包，如果不把变量添加到依赖里面，就取不到最新的变量值，使用 `useImmutable` 保存变量，就可以在函数内部取到最新的变量值。

### Example

```tsx
import React, { useReducer, useCallback, useEffect } from 'react';
import { Button, message } from 'antd';
import { useImmutable, useForceUpdate } from '@shihengtech/hooks';

export default (() => {
  const [value, add] = useReducer((x) => x + 1, 0);
  const valueRef = useImmutable(value);

  const alertMessage = useCallback(() => {
    message.info(`value: ${value}, actual value: ${valueRef.current}`);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(add, 1000);

    return () => clearTimeout(timeout);
  }, [value]);

  return <Button onClick={alertMessage}>让我看看</Button>;
}) as React.FC;
```

### Types

```typescript
useImmutable<D>(val: D): React.MutableRefObject<D>
```

### API

```typescript
const valueRef = useImmutable(1);
```

### Params

| 参数         | 说明           | 类型  | 默认值 |
| ------------ | -------------- | ----- | ------ |
| initialValue | 你要存储的变量 | `any` | -      |

### Result

| 参数     | 说明            | 类型                     |
| -------- | --------------- | ------------------------ |
| valueRef | 返回值同 useRef | `React.MutableRefObject` |
