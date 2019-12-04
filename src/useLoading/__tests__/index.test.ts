import { useState } from 'react';
/* eslint-disable max-nested-callbacks */
import { renderHook, act } from '@testing-library/react-hooks';
import useLoading from '../index';
import { delay } from '../../utils';

const MagicErrorNumber = 42;
jest.useFakeTimers();

describe('useLoading', () => {
  it('should be defined', () => {
    expect(useLoading).toBeDefined();
  });

  const setUp = ({
    successCallback,
    errorCallBack,
  }: {
    successCallback?: Function;
    errorCallBack?: Function;
  }) =>
    renderHook(() => {
      const [count, setCount] = useState(0);
      const add = () => setCount(r => r + 1);

      const onSuccess = (result: number, params: [number]) => {
        if (successCallback) {
          successCallback(count, result, params);
        }
      };

      const onError = (error: Error, params: [number]) => {
        if (errorCallBack) {
          errorCallBack(count, error, params);
        }
      };

      const useLoadingResponse = useLoading(
        async (arg: number) => {
          await delay(arg);
          if (arg === MagicErrorNumber) {
            throw new Error(`${MagicErrorNumber}`);
          }
          return arg + count;
        },
        {
          onSuccess,
          onError,
        },
      );

      return {
        count,
        add,
        useLoadingResponse,
      };
    });

  it('SuccessCallback should be called with latest state', async () => {
    const successCallback = jest.fn();

    let hook = setUp({ successCallback });

    act(() => {
      hook.result.current.add();
    });
    act(() => {
      hook.result.current.useLoadingResponse.run(10);
    });
    expect(hook.result.current.count).toEqual(1);
    jest.runAllTimers();
    await hook.waitForNextUpdate();
    expect(successCallback).lastCalledWith(1, 11, [10]);
  });

  it('ErrorCallBack should be called with latest state', async () => {
    const errorCallBack = jest.fn();

    let hook = setUp({ errorCallBack });

    act(() => {
      hook.result.current.add();
    });
    act(() => {
      hook.result.current.useLoadingResponse.run(MagicErrorNumber);
    });
    expect(hook.result.current.count).toEqual(1);
    jest.runAllTimers();
    await hook.waitForNextUpdate();
    expect(errorCallBack).lastCalledWith(1, new Error(`${MagicErrorNumber}`), [MagicErrorNumber]);
  });

  it('run and cancel should never change', async () => {
    const successCallback = jest.fn();

    let hook = setUp({ successCallback });
    let run = hook.result.current.useLoadingResponse.run;
    let cancel = hook.result.current.useLoadingResponse.cancel;
    act(() => {
      hook.result.current.add();
    });
    expect(run === hook.result.current.useLoadingResponse.run).toBeTruthy();
    expect(cancel === hook.result.current.useLoadingResponse.cancel).toBeTruthy();
  });

  it('loading and params should be correct', async () => {
    const successCallback = jest.fn();

    let hook = setUp({ successCallback });

    expect(hook.result.current.useLoadingResponse.loading).toBeFalsy();
    expect(hook.result.current.useLoadingResponse.params).toBeUndefined();

    act(() => {
      hook.result.current.useLoadingResponse.run(2000);
    });

    expect(hook.result.current.useLoadingResponse.loading).toBeTruthy();
    expect(hook.result.current.useLoadingResponse.params).toEqual([2000]);

    jest.advanceTimersByTime(1000);

    act(() => {
      hook.result.current.useLoadingResponse.run(3000);
    });

    expect(hook.result.current.useLoadingResponse.loading).toBeTruthy();
    expect(hook.result.current.useLoadingResponse.params).toEqual([3000]);
    expect(successCallback).toBeCalledTimes(0);

    jest.advanceTimersByTime(5000);
    await hook.waitForNextUpdate();

    expect(successCallback).toBeCalledTimes(1);
    expect(successCallback).lastCalledWith(0, 3000, [3000]);
    expect(hook.result.current.useLoadingResponse.loading).toBeFalsy();
    expect(hook.result.current.useLoadingResponse.params).toEqual([3000]);
  });

  it('cancel should work correct', async () => {
    const successCallback = jest.fn();

    let hook = setUp({ successCallback });

    expect(hook.result.current.useLoadingResponse.loading).toBeFalsy();
    expect(hook.result.current.useLoadingResponse.params).toBeUndefined();

    act(() => {
      hook.result.current.useLoadingResponse.run(2000);
    });

    expect(hook.result.current.useLoadingResponse.loading).toBeTruthy();
    expect(hook.result.current.useLoadingResponse.params).toEqual([2000]);

    jest.advanceTimersByTime(1000);

    act(() => {
      hook.result.current.useLoadingResponse.cancel();
    });

    expect(hook.result.current.useLoadingResponse.loading).toBeFalsy();
    expect(hook.result.current.useLoadingResponse.params).toEqual([2000]);

    expect(successCallback).toBeCalledTimes(0);
  });
});
