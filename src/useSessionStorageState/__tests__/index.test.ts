import { renderHook, act } from '@testing-library/react-hooks';
import useSessionStorageState from '../index';

describe('useSessionStorageState', () => {
  it('should be defined', () => {
    expect(useSessionStorageState).toBeDefined();
  });

  const setUp = <T>(key: string, value: T) =>
    renderHook(() => {
      const [state, setState] = useSessionStorageState<T>(key, value);
      return {
        state,
        setState,
      } as const;
    });

  it('getKey should work', () => {
    const LOCAL_STORAGE_KEY = 'test-key';
    const hook = setUp(LOCAL_STORAGE_KEY, 'A');
    expect(hook.result.current.state).toEqual('A');
    act(() => {
      hook.result.current.setState('B');
    });
    expect(hook.result.current.state).toEqual('B');
    const anotherHook = setUp(LOCAL_STORAGE_KEY, 'A');
    expect(anotherHook.result.current.state).toEqual('B');
    act(() => {
      anotherHook.result.current.setState('C');
    });
    expect(anotherHook.result.current.state).toEqual('C');
    expect(hook.result.current.state).toEqual('B');
  });

  it('should support object', () => {
    const LOCAL_STORAGE_KEY = 'test-object-key';
    const hook = setUp<{ name: string }>(LOCAL_STORAGE_KEY, {
      name: 'A',
    });
    expect(hook.result.current.state).toEqual({ name: 'A' });
    act(() => {
      hook.result.current.setState({ name: 'B' });
    });
    expect(hook.result.current.state).toEqual({ name: 'B' });
    const anotherHook = setUp(LOCAL_STORAGE_KEY, {
      name: 'C',
    });
    expect(anotherHook.result.current.state).toEqual({ name: 'B' });
    act(() => {
      anotherHook.result.current.setState({
        name: 'C',
      });
    });
    expect(anotherHook.result.current.state).toEqual({ name: 'C' });
    expect(hook.result.current.state).toEqual({ name: 'B' });
  });

  it('should support number', () => {
    const LOCAL_STORAGE_KEY = 'test-number-key';
    const hook = setUp(LOCAL_STORAGE_KEY, 1);
    expect(hook.result.current.state).toEqual(1);
    act(() => {
      hook.result.current.setState(2);
    });
    expect(hook.result.current.state).toEqual(2);
    const anotherHook = setUp(LOCAL_STORAGE_KEY, 3);
    expect(anotherHook.result.current.state).toEqual(2);
    act(() => {
      anotherHook.result.current.setState(3);
    });
    expect(anotherHook.result.current.state).toEqual(3);
    expect(hook.result.current.state).toEqual(2);
  });

  it('should support boolean', () => {
    const LOCAL_STORAGE_KEY = 'test-boolean-key';
    const hook = setUp(LOCAL_STORAGE_KEY, true);
    expect(hook.result.current.state).toEqual(true);
    act(() => {
      hook.result.current.setState(false);
    });
    expect(hook.result.current.state).toEqual(false);
    const anotherHook = setUp(LOCAL_STORAGE_KEY, true);
    expect(anotherHook.result.current.state).toEqual(false);
    act(() => {
      anotherHook.result.current.setState(true);
    });
    expect(anotherHook.result.current.state).toEqual(true);
    expect(hook.result.current.state).toEqual(false);
  });

  it('should support null', () => {
    const LOCAL_STORAGE_KEY = 'test-boolean-key-with-null';
    const hook = setUp<boolean | null>(LOCAL_STORAGE_KEY, false);
    expect(hook.result.current.state).toEqual(false);
    act(() => {
      hook.result.current.setState(null);
    });
    expect(hook.result.current.state).toEqual(null);
    const anotherHook = setUp(LOCAL_STORAGE_KEY, false);
    expect(anotherHook.result.current.state).toEqual(null);
  });

  it('should support clean data', () => {
    const LOCAL_STORAGE_KEY = 'test-clean-data';
    const hook = setUp<boolean>(LOCAL_STORAGE_KEY, false);
    expect(hook.result.current.state).toEqual(false);
    act(() => {
      hook.result.current.setState(true);
    });
    expect(hook.result.current.state).toEqual(true);
    act(() => {
      hook.result.current.setState();
    });
    expect(hook.result.current.state).toEqual(false);
    const anotherHook = setUp(LOCAL_STORAGE_KEY, true);
    expect(anotherHook.result.current.state).toEqual(true);
  });
});
