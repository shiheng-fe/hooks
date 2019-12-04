import { useState } from 'react';
/* eslint-disable max-nested-callbacks */
import { renderHook, act } from '@testing-library/react-hooks';
import useLoading from '../index';

describe('useLoading', () => {
  it('should be defined', () => {
    expect(useLoading).toBeDefined();
  });

  it('SuccessCallback should be called with latest state', async () => {
    const successCallback = jest.fn();

    let hook = renderHook(() => {
      const [count, setCount] = useState(0);
      const add = () => setCount(r => r + 1);

      const useLoadingResponse = useLoading(
        async (arg: number) => {
          return arg;
        },
        {
          onSuccess(result, params) {
            successCallback(count, result, params);
          },
        },
      );

      return {
        count,
        add,
        useLoadingResponse,
      };
    });

    act(() => {
      hook.result.current.add();
    });

    act(() => {
      hook.result.current.useLoadingResponse.run(10);
    });
    expect(hook.result.current.count).toEqual(1);
    await hook.waitForNextUpdate();
    expect(successCallback).lastCalledWith(1, 10, [10]);
  });
});
