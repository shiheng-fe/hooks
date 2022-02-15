---
nav:
  title: Hooks
  path: /hooks

group:
  title: common
  path: /common
---

<!-- TODO: 待补充 -->

# useModal
结合antd的modal
## Examples

```tsx
export default (() => {

  const { visible, initValue, openModal, closeModal } = useModal<number>();
  return (
    <>
      <Button onClick={() => openModal(1)}>显示对话框</Button>
      <Modal visible={visible} onCancel={closeModal}>initValue是{initValue}</Modal>
    </>
  );

}) as React.FC;
```

## Types

```typescript
type IUseModalResult<T = undefined> = {
  visible: boolean;
  initValue?: T;
  openModal: (initValue?: T) => void;
  closeModal: () => void;
};
```

## API

```typescript
const { visible, initValue, openModal, closeModal } = useModal<number>();
```

### Result

| 参数         | 说明                            | 类型                        |
| ---------- | ----------------------------- | ------------------------- |
| visible    | 用于modal的visble                | `boolean`                 |
| initValue  | openModal里的参数                 | `any`                     |
| openModal  | 该方法用于打开对话框，第一个参数是返回的initValue | `(initValue?: T) => void` |
| closeModal | 该方法用于关闭对话框。                   | `() => void`              |
