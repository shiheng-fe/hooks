import { renderHook, act } from '@testing-library/react-hooks';
import useToggle from '../index';

describe('useToggle', () => {
  it('should be defined', () => {
    expect(useToggle).toBeDefined();
  });

  const setUp = (value: boolean) =>
    renderHook(() => {
      const [state, toggle] = useToggle(value);
      return {
        state,
        toggle,
      };
    });

  it('useToggle should work', () => {
    const hook = setUp(false);
    expect(hook.result.current.state).toEqual(false);

    act(() => {
      hook.result.current.toggle();
    });
    expect(hook.result.current.state).toEqual(true);

    const anotherHook = setUp(true);
    expect(anotherHook.result.current.state).toEqual(true);

    act(() => {
      anotherHook.result.current.toggle();
    });
    expect(anotherHook.result.current.state).toEqual(false);
    expect(hook.result.current.state).toEqual(true);

    act(() => {
      hook.result.current.toggle(true);
    });
    expect(hook.result.current.state).toEqual(true);

    act(() => {
      hook.result.current.toggle('哈哈哈');
    });
    expect(hook.result.current.state).toEqual(false);
  });
});
