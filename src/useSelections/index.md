---
nav:
  title: Hooks
  path: /hooks

group:
  title: common
  path: /common
---

# useSelections

This hook is used for checkbox group, supports multiple selection, single selection, select-all, select-none and semi-selected.

## Examples

一个简单示例来展示如何使用 useSelections，可以结合 checkboxGroup，也可以结合类似的用 true,false 控制的组件。

```tsx
import React from 'react';
import { Checkbox, Space, Button, Divider } from 'antd';
import { useSelections, useForceUpdate } from '@shihengtech/hooks';

const CheckboxGroup = Checkbox.Group;

export default (() => {
  const options = ['apple', 'banana', 'orange', 'pear'];
  const {
    selected,
    isSelected,
    select,
    unSelect,
    toggle,
    selectAll,
    unSelectAll,
    allSelected,
    noneSelected,
    partiallySelected,
    setSelected,
    toggleAll,
  } = useSelections(options);
  const yesOrNo = { true: '是', false: '否' };
  return (
    <>
      <Space>
        <Button onClick={selectAll}>我要吃全部水果</Button>
        <Button onClick={unSelectAll}>一个水果都没想吃的</Button>
        <Button onClick={toggleAll}>把口味换一换</Button>
        <Button onClick={() => select('apple')}>吃苹果</Button>
        <Button onClick={() => unSelect('apple')}>不吃苹果</Button>
      </Space>
      <Divider></Divider>
      <CheckboxGroup options={options} value={selected}></CheckboxGroup>
      <Divider></Divider>
      `数据分析：是否选了全部水果 {yesOrNo[`${allSelected}`]}
      ,是否一个水果都没选 {yesOrNo[`${noneSelected}`]}
      ,是否有选水果 {yesOrNo[`${partiallySelected}`]}, `
    </>
  );
}) as React.FC;
```

## API

```tsx | pure
const result: Result = useSelections<T>(items: T[]);
```

### Params

| 参数  | 说明                 | 类型  | 默认值 |
| ----- | -------------------- | ----- | ------ |
| items | 选择操作基于的数组。 | `T[]` | -      |

### Result

| Property          | Description                 | Type                  |
| ----------------- | --------------------------- | --------------------- |
| selected          | selected Items              | array                 |
| isSelected        | Whether item is selected    | (value: T) => boolean |
| select            | Select item                 | (value: T) => void    |
| unSelect          | UnSelect item               | (value: T) => void    |
| toggle            | Toggle item select status   | (value: T) => void    |
| selectAll         | Select all items            | () => void            |
| unSelectAll       | UnSelect all items          | (value: T) => void    |
| toggleAll         | Toggle select all items     | (value: T) => void    |
| allSelected       | Is all items selected       | boolean               |
| noneSelected      | Is no item selected         | boolean               |
| partiallySelected | Is partially items selected | boolean               |
| setSelected       | Set selected items          | (value:T[]) => void   |
