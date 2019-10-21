import { renderHook, act, RenderHookResult } from '@testing-library/react-hooks';
import useFetch /* useLoading */ from '..';

describe('useLoading', () => {
  it('should be defined', () => {
    expect(useFetch).toBeDefined();
  });

  // const request = async (params: any) => {
  //   await new Promise(resolve => setTimeout(resolve, 1000));
  //   return params || 'result';
  // };

  // let hook: RenderHookResult<any, ReturnType<typeof useLoading>>;

  it('should return loading and run function', () => {
    // TODO:
  });
});

describe('useFetch', () => {
  it('should be defined', () => {
    expect(useFetch).toBeDefined();
  });

  const request = async (params: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return params || 'result';
  };

  let hook: RenderHookResult<any, ReturnType<typeof useFetch>>;

  it('should auto run', async () => {
    const onSuccess = jest.fn(result => ({ data: result }));
    const onError = jest.fn(error => ({ error }));

    act(() => {
      hook = renderHook(() => useFetch(request, [], { onSuccess, onError }));
    });
    expect(hook.result.current.loading).toEqual(true);
    await hook.waitForNextUpdate();
    expect(hook.result.current.loading).toEqual(false);
    expect(hook.result.current.data).toEqual('result');
    expect(onError).not.toHaveBeenCalled();
    expect(onSuccess).toHaveBeenCalled();

    act(() => {
      hook.result.current.run(1);
    });
    expect(hook.result.current.loading).toEqual(true);
    await hook.waitForNextUpdate();
    expect(hook.result.current.data).toEqual(1);
    expect(hook.result.current.loading).toEqual(false);
    expect(onError).not.toHaveBeenCalled();
    expect(onSuccess).toHaveBeenCalled();
  });
});
