---
nav:
  path: /hooks
---

# useImmutableFn

[useImmutable](use-immutable) 的函数版本，返回结果为一个同类型的函数，可直接调用，去除了通过 `current` 的方式取值

### Types

```typescript
useImmutableFn<T extends (...args: any[]) => any>(fn: T): T
```

### API

```typescript
const fn = useImmutableFn(() => console.log('😁'));
```
