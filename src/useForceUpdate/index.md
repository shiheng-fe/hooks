---
nav:
  path: /hooks
---

# useForceUpdate

一个能够强制函数组件重新渲染的 `hook`，类似于 `class` 组件中的 `this.forceUpdate()`。

### Examples

```tsx
import React, { useRef } from 'react';
import { Button } from 'antd';
import { useForceUpdate } from '@shihengtech/hooks';

export default (() => {
  const forceUpdate = useForceUpdate();
  const refValue = useRef(-1);
  setTimeout(() => {
    refValue.current = 2;
  });
  return (
    <>
      <Button onClick={forceUpdate}>点击</Button>
      <div>refValue的值 {refValue.current}</div>
    </>
  );
}) as React.FC;
```

### Types

```typescript
useForceUpdate(): () => void;
```

### API

```typescript
const forceUpdate = useForceUpdate();
```

### Result

| 参数        | 说明                               | 类型         |
| ----------- | ---------------------------------- | ------------ |
| forceUpdate | 一个执行了就会强制性刷新组件的函数 | `() => void` |
