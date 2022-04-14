---
nav:
  path: /hooks
---

# useModal

结合 antd 的 modal

## Examples

```tsx
import React from 'react';
import { Button, Modal } from 'antd';
import { useModal } from '@shihengtech/hooks';

export default (() => {
  const { visible, initValue, openModal, closeModal } = useModal<number>();
  return (
    <>
      <Button onClick={() => openModal(1)}>显示对话框</Button>
      <Modal visible={visible} onCancel={closeModal}>
        initValue是{initValue}
      </Modal>
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

| 参数       | 说明                                               | 类型                      |
| ---------- | -------------------------------------------------- | ------------------------- |
| visible    | 用于 modal 的 visble                               | `boolean`                 |
| initValue  | openModal 里的参数                                 | `any`                     |
| openModal  | 该方法用于打开对话框，第一个参数是返回的 initValue | `(initValue?: T) => void` |
| closeModal | 该方法用于关闭对话框。                             | `() => void`              |
