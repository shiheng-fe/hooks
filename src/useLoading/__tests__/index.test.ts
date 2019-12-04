import { useState } from 'react';
/* eslint-disable max-nested-callbacks */
import { renderHook, act } from '@testing-library/react-hooks';
import useLoading from '../index';

const MagicErrorNumber = 42;

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
});
