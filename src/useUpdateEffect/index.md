---
nav:
  title: Hooks
  path: /hooks

group:
  title: common
  path: /common
---

# useUpdateEffect
useUpdateEffect与effect的入参，效果都是完全一致的，唯一的区别是effect无论如何都会执行一次在一开始渲染时，而useUpdateEffect第一次初始渲染是不会执行的，只有当deps数据发生改变才会执行。
## Examples
下面这个示例显示出useUpdateEffect和useEffect的区别。
```tsx
export default (() => {
  const [value, setValue] = useState(1);
  useUpdateEffect(() => {
    console.log('执行updateEffect');
  }, [value]);
  useEffect(() => {
    console.log('执行effect');
  },[value])
  return (
    <>
      <Button onClick={() => setValue(v => v+1)}>setValue</Button> {value}
    </>
  );

}) as React.FC;
```

## API、Params、Action
同useEffect
