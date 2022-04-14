---
nav:
  path: /hooks
---

# useLoading

一个将 loading 的使用抽离出来的 hook。

## Examples

最基础的用法，就是给 useLoading 传入一个异步函数，在异步函数执行期间，loading 会为 true，异步函数成功后会执行 onSuccess。

```tsx
import React from 'react';
import { Button } from 'antd';
import { useLoading } from '@shihengtech/hooks';

export default (() => {
  const sleep = (ms: number) => {
    return new Promise(function (resolve, reject) {
      setTimeout(resolve, ms);
    });
  };
  const { run, loading } = useLoading(
    async () => {
      await sleep(2000);
      return '成功loading2s';
    },
    {
      onSuccess: (res) => {
        console.log(res);
        // 打印'成功loading2s'
      },
    },
    { loading: false },
  );
  return (
    <Button loading={loading} onClick={run}>
      点击
    </Button>
  );
}) as React.FC;
```

## Types

```typescript
type IUseLoadingState<T extends (...args: any[]) => Promise<any>> = {
  loading: boolean;
  params?: Parameters<T>;
};
type IUseLoadingOption<T extends (...args: any[]) => Promise<any>> = {
  onSuccess?: (result: PromiseReturnType<T>, params: Parameters<T>) => void;
  onError?: (error: Error, params: Parameters<T>) => void;
};
```

## API

```typescript
const { setState, run, loading, cancel, params } = useLoading(fn: (...args: any[]) => Promise<any>>  ,options?: IUseLoadingOptions<T>, initialState?: Partial<IUseLoadingState<T>> )
```

### Params

| 参数         | 说明                                                 | 类型                                | 默认值 |
| ------------ | ---------------------------------------------------- | ----------------------------------- | ------ |
| fn           | 必填，在这个异步函数执行期间，返回得 loading 为 true | `(...args: any[]) => Promise<any>>` | -      |
| options      | 配置当 fn 执行完成后的操作，详见下面的 Options       | `IUseLoadingOptions`                | -      |
| initialState | 配置初始值，详见下面的 initialState                  | `IUseLoadingState`                  | -      |

### Options

| 参数       | 说明                                                                                                                              | 类型                                         | 默认值 |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- | ------ |
| onSuccess  | 当异步函数执行`成功`后，将返回值传入该函数中作为第一个参数，第二个参数为 fn 中的 params，并执行。                                 | `(result,...params) => void`                 | -      |
| onError    | 当异步函数执行`失败`后，将返回值传入该函数中作为第一个参数，第二个参数为 fn 中的 params，并执行。                                 | `(result,...params) => void`                 | -      |
| onFinished | 当异步函数执行后，无论`成功`、`失败`，将返回值与函数成功与否的信息传入该函数中作为第一个参数，第二个参数为 fn 的 params，并执行。 | `({successful, payload}, ...params) => void` | -      |

### initialState

| 参数    | 说明              | 类型      | 默认值 |
| ------- | ----------------- | --------- | ------ |
| loading | loading 的初始值  | `boolean` | false  |
| params  | fn 里参数的初始值 | `any[]`   | -      |

### Result

| 参数     | 说明                                     | 类型                      |
| -------- | ---------------------------------------- | ------------------------- |
| setState | 提供一个修改 loading,fn 参数的函数       | `React.useEffect`         |
| run      | 触发执行 fn，函数参数将会传递给 fn       | `(...args: any[]) => any` |
| cancel   | 取消 onSuccess、onError、onFinished 效果 | `() => void`              |
| loading  | 返回的 loading 值                        | `boolean`                 |
| params   | fn 的参数                                | `any`                     |
