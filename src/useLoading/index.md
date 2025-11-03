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
import { Button, Space } from 'antd';
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
      console.log(1111);
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

  const { run: debounceRun } = useLoading(
    async () => {
      await sleep(2000);
      console.log(2222);
      return '成功loading2s';
    },
    {
      debounceWait: 300,
      onSuccess: (res) => {
        console.log(res);
        // 打印'成功loading2s'
      },
    },
    { loading: false },
  );
  return (
    <Space>
      <Button loading={loading} onClick={run}>
        loading点击
      </Button>
      <Button onClick={run}>普通点击</Button>
      <Button onClick={debounceRun}>防抖点击</Button>
    </Space>
  );
}) as React.FC;
```

### 防抖功能与返回值测试

下面是一个完整的测试示例，展示如何测试防抖功能和返回值：

```tsx
import React, { useState } from 'react';
import { Button, Space, Card, Typography, Divider, message } from 'antd';
import { useLoading } from '@shihengtech/hooks';

const { Title, Text, Paragraph } = Typography;

export default (() => {
  const sleep = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  // 模拟 API 请求
  const fetchData = async (id: number) => {
    await sleep(1000);
    return { id, name: `User ${id}`, timestamp: Date.now() };
  };

  // 普通模式（无防抖）
  const {
    run: normalRun,
    loading: normalLoading,
    cancel: normalCancel,
  } = useLoading(fetchData, {
    onSuccess: (result) => {
      message.success(`普通模式成功: ${JSON.stringify(result)}`);
    },
  });

  // 防抖模式
  const {
    run: debounceRun,
    loading: debounceLoading,
    cancel: debounceCancel,
  } = useLoading(fetchData, {
    debounceWait: 500, // 500ms 防抖
    onSuccess: (result) => {
      message.success(`防抖模式成功: ${JSON.stringify(result)}`);
    },
  });

  // 返回值测试
  const [returnValue, setReturnValue] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // 测试防抖返回值
  const testDebounceReturnValue = async () => {
    setReturnValue(null);
    setErrorMessage('');

    try {
      // ✅ 防抖模式下 run 返回 Promise
      const result = await debounceRun(999);
      setReturnValue(result);
      message.success('防抖返回值测试成功！');
    } catch (error: any) {
      setErrorMessage(error.message);
      message.error('防抖返回值测试失败');
    }
  };

  // 测试普通返回值
  const testNormalReturnValue = async () => {
    setReturnValue(null);
    setErrorMessage('');

    try {
      // ✅ 普通模式下 run 也返回 Promise
      const result = await normalRun(888);
      setReturnValue(result);
      message.success('普通返回值测试成功！');
    } catch (error: any) {
      setErrorMessage(error.message);
      message.error('普通返回值测试失败');
    }
  };

  // 测试链式调用
  const testChainCall = () => {
    setReturnValue(null);
    setErrorMessage('');

    debounceRun(777)
      .then((result) => {
        setReturnValue(result);
        return result.id;
      })
      .then((id) => {
        message.success(`链式调用成功，ID: ${id}`);
      })
      .catch((error: Error) => {
        setErrorMessage(error.message);
        message.error('链式调用失败');
      });
  };

  // 测试快速连续点击（验证防抖）
  const [clickCount, setClickCount] = useState(0);
  const [executeCount, setExecuteCount] = useState(0);

  const testQuickClick = () => {
    setClickCount((prev) => prev + 1);
    debounceRun(clickCount + 1);
  };

  // 记录实际执行次数
  const { run: debounceRunWithCounter } = useLoading(
    async (count: number) => {
      await sleep(500);
      setExecuteCount((prev) => prev + 1);
      return { executed: true, count };
    },
    {
      debounceWait: 300,
      onSuccess: () => {
        message.info(`实际执行了 ${executeCount + 1} 次`);
      },
    },
  );

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card title="基础功能测试">
        <Space>
          <Button
            loading={normalLoading}
            onClick={() => normalRun(1)}
            type="primary"
          >
            普通模式 (无防抖)
          </Button>
          <Button
            loading={debounceLoading}
            onClick={() => debounceRun(2)}
            type="primary"
          >
            防抖模式 (500ms)
          </Button>
          <Button onClick={normalCancel}>取消普通</Button>
          <Button onClick={debounceCancel}>取消防抖</Button>
        </Space>
      </Card>

      <Card title="返回值测试">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Paragraph>
            <Text strong>测试说明：</Text>
            验证 run 方法返回 Promise，可以在防抖和非防抖模式下使用
          </Paragraph>
          <Space>
            <Button onClick={testNormalReturnValue}>测试普通返回值</Button>
            <Button onClick={testDebounceReturnValue} type="primary">
              测试防抖返回值
            </Button>
            <Button onClick={testChainCall}>测试链式调用</Button>
          </Space>
          {returnValue && (
            <Card size="small" style={{ background: '#f0f9ff' }}>
              <Title level={5}>返回值：</Title>
              <pre>{JSON.stringify(returnValue, null, 2)}</pre>
            </Card>
          )}
          {errorMessage && (
            <Card size="small" style={{ background: '#fff1f0' }}>
              <Title level={5}>错误信息：</Title>
              <Text type="danger">{errorMessage}</Text>
            </Card>
          )}
        </Space>
      </Card>

      <Card title="防抖功能测试">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Paragraph>
            <Text strong>测试说明：</Text>
            快速连续点击按钮，验证防抖效果（只执行最后一次）
          </Paragraph>
          <Space>
            <Button onClick={testQuickClick} type="primary">
              快速点击我 ({clickCount} 次)
            </Button>
            <Button onClick={() => setClickCount(0)}>重置计数</Button>
          </Space>
          <Divider />
          <Paragraph>
            <Text strong>实际执行测试：</Text>
            快速点击下方按钮多次，观察控制台，应该只执行最后一次
          </Paragraph>
          <Button
            onClick={() => {
              // 快速连续调用 5 次
              for (let i = 0; i < 5; i++) {
                debounceRunWithCounter(i + 1);
              }
            }}
            type="dashed"
          >
            快速连续点击 5 次
          </Button>
          <Text>
            点击次数: {clickCount} | 实际执行次数: {executeCount}
          </Text>
        </Space>
      </Card>

      <Card title="async/await 语法测试">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Paragraph>
            <Text strong>测试说明：</Text>
            展示如何在防抖模式下使用 async/await 获取返回值
          </Paragraph>
          <Button
            type="primary"
            onClick={async () => {
              try {
                // ✅ 防抖模式下可以使用 async/await
                const result = await debounceRun(123);
                message.success(
                  `async/await 获取到返回值: ${JSON.stringify(result)}`,
                );
              } catch (error) {
                message.error('async/await 错误');
              }
            }}
          >
            使用 async/await 获取返回值
          </Button>
        </Space>
      </Card>
    </Space>
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
