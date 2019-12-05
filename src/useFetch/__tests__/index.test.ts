import { useState } from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import useFetch, { IUseFetchOptions } from '../index';
import { delay } from '../../utils';

jest.useFakeTimers();

describe('useFetch', () => {
  it('should be defined', () => {
    expect(useFetch).toBeDefined();
  });

  async function mockFunction(timeout: number, throwError: boolean) {
    await delay(timeout);
    if (throwError) {
      throw new Error(`${timeout}`);
    }
    return timeout;
  }

  const setUp = (option?: IUseFetchOptions<typeof mockFunction>) =>
    renderHook(() => {
      const [state, setState] = useState({
        timeout: 1000,
        throwError: false,
      });

      const [addTimeout, setAddTimeout] = useState(0);

      const useFetchResponse = useFetch(
        () => mockFunction(state.timeout + addTimeout, state.throwError),
        [addTimeout],
        option,
      );

      return {
        setState,
        useFetchResponse,
        setAddTimeout,
      };
    });

  describe('test options.auto', () => {
    it('should auto run when option is undefined', () => {
      let hook = setUp();
      expect(hook.result.current.useFetchResponse.loading).toBeTruthy();
      expect(hook.result.current.useFetchResponse.params).toEqual([]);
      expect(hook.result.current.useFetchResponse.data).toBeUndefined();
      expect(hook.result.current.useFetchResponse.error).toBeUndefined();
    });

    it('should auto run when auto is undefined', () => {
      let hook = setUp({});
      expect(hook.result.current.useFetchResponse.loading).toBeTruthy();
      expect(hook.result.current.useFetchResponse.params).toEqual([]);
      expect(hook.result.current.useFetchResponse.data).toBeUndefined();
      expect(hook.result.current.useFetchResponse.error).toBeUndefined();
    });

    it('should auto run when dependencyList change', async () => {
      let hook = setUp({});
      expect(hook.result.current.useFetchResponse.loading).toBeTruthy();
      expect(hook.result.current.useFetchResponse.params).toEqual([]);
      expect(hook.result.current.useFetchResponse.data).toBeUndefined();
      expect(hook.result.current.useFetchResponse.error).toBeUndefined();

      jest.advanceTimersByTime(2000);

      await hook.waitForNextUpdate();

      expect(hook.result.current.useFetchResponse.loading).toBeFalsy();
      expect(hook.result.current.useFetchResponse.params).toEqual([]);
      expect(hook.result.current.useFetchResponse.data).toBe(1000);
      expect(hook.result.current.useFetchResponse.error).toBeUndefined();

      act(() => {
        hook.result.current.setAddTimeout(1000);
      });

      expect(hook.result.current.useFetchResponse.loading).toBeTruthy();
      expect(hook.result.current.useFetchResponse.params).toEqual([]);
      expect(hook.result.current.useFetchResponse.data).toBe(1000);
      expect(hook.result.current.useFetchResponse.error).toBeUndefined();
    });

    it('should not auto run when auto is false', () => {
      let hook = setUp({ auto: false });
      expect(hook.result.current.useFetchResponse.loading).toBeFalsy();
      expect(hook.result.current.useFetchResponse.params).toBeUndefined();
      expect(hook.result.current.useFetchResponse.data).toBeUndefined();
      expect(hook.result.current.useFetchResponse.error).toBeUndefined();
    });
  });
});
