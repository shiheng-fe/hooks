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

## API

```tsx | pure
const result: Result = useSelections<T>(items: T[]);
```

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
