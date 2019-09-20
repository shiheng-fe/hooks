import { useState } from 'react';

export type IUseModalResult<T = undefined> = {
  visible: boolean;
  initValue?: T;
  openModal: (v?: T) => void;
  closeModal: () => void;
};

export default function useModal<T = undefined>(): IUseModalResult<T> {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState<T | undefined>();

  const openModal = (v?: T) => {
    setVisible(true);
    setValue(v);
  };

  const closeModal = () => {
    setVisible(false);
    setValue(undefined);
  };

  return {
    initValue: value,
    openModal,
    visible,
    closeModal,
  };
}
