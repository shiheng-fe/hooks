---
nav:
  title: Hooks
  path: /hooks

group:
  title: common
  path: /common
---

# useImmutable

用法同 useRef，但是每次组件重新渲染，执行该行代码，都会重新执行赋值语句，这点与 useRef 不同。

### Example

用法同 useRef,下面这个示例能够体现出同 useRef 的区别。

```tsx
import React, { useRef } from 'react';
import { Button } from 'antd';
import { useImmutable, useForceUpdate } from '@shihengtech/hooks';

export default (() => {
  const ref1 = useRef([1]);
  const ref2 = useImmutable([2]);
  const forceUpdate = useForceUpdate();
  ref1.current.push(10);
  ref2.current.push(20);
  console.log(ref1);
  console.log(ref2);
  return (
    <>
      <Button onClick={forceUpdate}>重新渲染</Button>
    </>
  );
}) as React.FC;
```

### API

```typescript
const value = useImmutable(1);
```

### Params

| 参数         | 说明          | 类型  | 默认值 |
| ------------ | ------------- | ----- | ------ |
| initialValue | 参数同 useRef | `any` | -      |

### Result

| 参数  | 说明              | 类型                     |
| ----- | ----------------- | ------------------------ |
| value | 返回参数同 useRef | `React.MutableRefObject` |
