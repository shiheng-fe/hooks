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

利用useToggle去实现一个更加方便去控制boolean值的变化，返回的toggle是一个setState函数，也就是说使用这个函数会渲染组件。

## Examples

```tsx
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

| 参数  | 说明  | 类型  | 默认值 |
| --- | --- | --- | --- |
| initialValue | 必填，返回的value的初始值 | `boolean` | -   |

### Result

| 参数  | 说明  | 类型  |
| --- | --- | --- |
| value | useToggle用来控制的value | `boolean` |
| toggle | 第一个参数如果是boolean值，那么value会赋值为第一个参数，如果不是boolean值，那么value会取反。 | `(nextValue: any) => void` |
