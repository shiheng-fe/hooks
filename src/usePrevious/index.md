---
nav:
  title: Hooks
  path: /hooks

group:
  title: common
  path: /common
---

<!-- TODO: 待补充 -->

# usePrevious
参数和返回数据同useRef，区别是返回的值是渲染之前的值。
## Examples

```tsx
export default (() => {
  const initValue = useRef<number[]>([]);
  initValue.current.push(1);
  const value = usePrevious<number[]>(initValue.current);
  const forceUpdate = useForceUpdate()
  console.log(value);

  return (
    <>
      <Button onClick={forceUpdate}>强制刷新</Button>
    </>
  );

}) as React.FC;
```
