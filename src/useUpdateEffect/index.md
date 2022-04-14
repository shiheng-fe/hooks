---
nav:
  path: /hooks
---

# useUpdateEffect

`useUpdateEffect` 用法与 `useEffect` 一致，但会跳过首次执行，只有在后续依赖更新时才会执行。

## Examples

下面这个示例显示出 useUpdateEffect 和 useEffect 的区别。

```tsx
import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { useUpdateEffect } from '@shihengtech/hooks';

export default (() => {
  const [renderCount, setRenderCount] = useState(1);
  const [effectCount, setEffectCount] = useState(0);
  const [updateEffectCount, setUpdateEffectCount] = useState(0);

  useUpdateEffect(() => {
    setUpdateEffectCount((v) => v + 1);
  }, [renderCount]);

  useEffect(() => {
    setEffectCount((v) => v + 1);
  }, [renderCount]);

  return (
    <>
      <div>effect times: {effectCount}</div>
      <div>update effect times: {updateEffectCount}</div>
      <Button onClick={() => setRenderCount((v) => v + 1)}>reRender</Button>
    </>
  );
}) as React.FC;
```

## API、Params、Action

同 useEffect

```typescript
useUpdateEffect(
  effect: React.EffectCallback,
  deps?: React.DependencyList,
)

```
