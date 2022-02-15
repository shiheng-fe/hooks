---
nav:
  title: Hooks
  path: /hooks

group:
  title: common
  path: /common
---

# useLocalStorageState

useLocalStorageState与useState返回的结果是完全一致的，目的也是一样的，为了修改state，区别是useLocalStorage储存的值会存到localStorage中

## Examples

此时可在控制台用localStorage.getItem('key') 获取到值。

```tsx
export default (() => {
  const [localStorage, setLocalStorage] =  useLocalStorageState('key');
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

```tsx
 const [localStorage, setLocalStorage] =  useLocalStorageState('key');
```

### Params

| 参数  | 说明  | 类型  | 默认值 |
| --- | --- | --- | --- |
| key | 必填，localStorage存储的键值对的键值 | `string` | -   |

### Result

| 参数  | 说明  | 类型  |
| --- | --- | --- |
| [state, updateState] | 同useState，updateState会更新localStorage里的数据 | `-` |
