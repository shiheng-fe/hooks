---
nav:
  title: Hooks
  path: /hooks

group:
  title: common
  path: /common
---

# useLocalStorageState

useLocalStorageState 与 useState 返回的结果是完全一致的，目的也是一样的，为了修改 state，区别是 useLocalStorage 储存的值会存到 localStorage 中

## Examples

此时可在控制台用 localStorage.getItem('key') 获取到值。

```tsx
import React from 'react';
import { Button } from 'antd';
import { useLocalStorageState } from '@shihengtech/hooks';

export default (() => {
  const [localStorage, setLocalStorage] = useLocalStorageState('key', 1);
  return (
    <>
      <Button onClick={() => setLocalStorage((v) => v + 1)}>
        setLocalStorage
      </Button>
      {localStorage}
    </>
  );
}) as React.FC;
```

## API

```tsx | pure
const [localStorage, setLocalStorage] = useLocalStorageState('key');
```

### Params

| 参数 | 说明                                  | 类型     | 默认值 |
| ---- | ------------------------------------- | -------- | ------ |
| key  | 必填，localStorage 存储的键值对的键值 | `string` | -      |

### Result

| 参数                 | 说明                                                  | 类型 |
| -------------------- | ----------------------------------------------------- | ---- |
| [state, updateState] | 同 useState，updateState 会更新 localStorage 里的数据 | `-`  |
