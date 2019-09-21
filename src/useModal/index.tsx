import { useState } from 'react';

export type IUseModalResult<T = undefined> = {
  visible: boolean;
  initValue?: T;
  openModal: (initValue?: T) => void;
  closeModal: () => void;
};

export default function useModal<T = undefined>(): IUseModalResult<T> {
  const [visible, setVisible] = useState(false);
  const [initValue, setInitValue] = useState<T | undefined>();

  const openModal = (initValue?: T) => {
    setVisible(true);
    setInitValue(initValue);
  };

  const closeModal = () => {
    setVisible(false);
  };

  return {
    initValue,
    openModal,
    visible,
    closeModal,
  };
}
