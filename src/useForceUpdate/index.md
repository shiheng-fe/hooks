---
nav:
  title: Hooks
  path: /hooks

group:
  title: common
  path: /common
---

# useForceUpdate

一个能够强制刷新页面的 hook,利用 state 只要变化就会重新渲染页面的原理。

### Examples

返回的是一个函数，这个函数只要执行就能强制性的重新渲染当前的组件。

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
      <Button onClick={() => forceUpdate()}>点击</Button>
      <div>refValue的值 {refValue.current}</div>
    </>
  );
}) as React.FC;
```

### API

```typescript
const forceUpdate = useForceUpdate();
```

### Result

| 参数        | 说明                               | 类型         |
| ----------- | ---------------------------------- | ------------ |
| forceUpdate | 一个执行了就会强制性刷新组件的函数 | `() => void` |
