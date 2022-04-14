---
nav:
  path: /hooks
---

# usePrevious

参数和返回数据同 useRef，区别是返回的值是渲染之前的值。

## Examples

```tsx
import React, { useRef } from 'react';
import { Button } from 'antd';
import { usePrevious, useForceUpdate } from '@shihengtech/hooks';

export default (() => {
  const initValue = useRef<number[]>([]);
  initValue.current.push(1);
  const value = usePrevious<number[]>(initValue.current);
  const forceUpdate = useForceUpdate();
  console.log(value);

  return (
    <>
      <Button onClick={forceUpdate}>强制刷新</Button>
    </>
  );
}) as React.FC;
```
