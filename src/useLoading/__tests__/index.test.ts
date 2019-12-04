import { useState } from 'react';
/* eslint-disable max-nested-callbacks */
import { renderHook, act } from '@testing-library/react-hooks';
import useLoading from '../index';

describe('useLoading', () => {
  it('should be defined', () => {
    expect(useLoading).toBeDefined();
  });

  const setUp = (successCallback: Function) =>
    renderHook(() => {
      const [count, setCount] = useState(0);
      const add = () => setCount(r => r + 1);

      const onSuccess = (result: number, params: [number]) => {
        successCallback(count, result, params);
      };

      const useLoadingResponse = useLoading(
        async (arg: number) => {
          return arg + count;
        },
        {
          onSuccess,
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

    let hook = setUp(successCallback);

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

  it('run and cancel should never change', async () => {
    const successCallback = jest.fn();

    let hook = setUp(successCallback);
    let run = hook.result.current.useLoadingResponse.run;
    let cancel = hook.result.current.useLoadingResponse.cancel;
    act(() => {
      hook.result.current.add();
    });
    expect(run === hook.result.current.useLoadingResponse.run).toBeTruthy();
    expect(cancel === hook.result.current.useLoadingResponse.cancel).toBeTruthy();
  });
});
