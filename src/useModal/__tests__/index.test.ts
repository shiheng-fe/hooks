import { renderHook, act } from '@testing-library/react-hooks';
import useModal from '../index';

describe('useModal', () => {
  it('should be defined', () => {
    expect(useModal).toBeDefined();
  });

  const setUp = <T>() => renderHook(() => useModal<T>());

  it('should work correct without initValue', () => {
    const hook = setUp();
    expect(hook.result.current.visible).toEqual(false);
    act(() => {
      hook.result.current.openModal();
    });
    expect(hook.result.current.visible).toEqual(true);
    act(() => {
      hook.result.current.closeModal();
    });
    expect(hook.result.current.visible).toEqual(false);
  });

  describe('should work correct with initValue ', () => {
    const hook = setUp<{ name: string }>();

    it('should openModel with initValue works correct', () => {
      expect(hook.result.current.visible).toEqual(false);
      act(() => {
        hook.result.current.openModal({ name: 'DiamondYuan' });
      });
      expect(hook.result.current.initValue!.name).toEqual('DiamondYuan');
    });

    it('should closeModal not clean initValue', () => {
      act(() => {
        hook.result.current.closeModal();
      });
      expect(hook.result.current.visible).toEqual(false);
      expect(hook.result.current.initValue!.name).toEqual('DiamondYuan');
    });
  });
});
