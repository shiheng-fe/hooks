---
nav:
  title: Hooks
  path: /hooks

group:
  title: common
  path: /common
---

# useUpdateEffect

useUpdateEffect 与 effect 的入参，效果都是完全一致的，唯一的区别是 effect 无论如何都会执行一次在一开始渲染时，而 useUpdateEffect 第一次初始渲染是不会执行的，只有当 deps 数据发生改变才会执行。

## Examples

下面这个示例显示出 useUpdateEffect 和 useEffect 的区别。

```tsx
import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { useUpdateEffect } from '@shihengtech/hooks';

export default (() => {
  const [value, setValue] = useState(1);
  useUpdateEffect(() => {
    console.log('执行updateEffect');
  }, [value]);
  useEffect(() => {
    console.log('执行effect');
  }, [value]);
  return (
    <>
      <Button onClick={() => setValue((v) => v + 1)}>setValue</Button> {value}
    </>
  );
}) as React.FC;
```

## API、Params、Action

同 useEffect
