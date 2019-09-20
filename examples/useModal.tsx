import * as React from 'react';
import useModal, { IUseModalResult } from '../src/useModal/index';
import { Modal, Button, Form, Input, Card, Table } from 'antd';
import './index.less';
import '../node_modules/antd/dist/antd.css';
import { FormComponentProps } from 'antd/lib/form';

const SampleModal: React.FC<IUseModalResult> = ({ visible, closeModal }) => {
  const handleOk = () => {
    console.log('ok');
    closeModal();
  };

  return <Modal title="Sample" visible={visible} onCancel={closeModal} onOk={handleOk}></Modal>;
};

interface Person {
  index: number;
  name: string;
}

type CreateEditModalProps = IUseModalResult<Person> &
  FormComponentProps & {
    addPerson: (name: string) => void;
    editPerson: (index: number, name: string) => void;
  };

const _CreateEditModal: React.FC<CreateEditModalProps> = ({
  visible,
  closeModal,
  form,
  initValue,
  addPerson,
  editPerson,
}) => {
  const editMode = !!initValue;
  const modalTitle = editMode ? 'Edit' : 'Create';

  const handleOk = () => {
    form.validateFields((error, value) => {
      if (error) {
        return;
      }
      if (editMode) {
        editPerson(initValue!.index, value.name);
      } else {
        addPerson(value.name);
      }
      closeModal();
    });
  };

  return (
    <Modal title={modalTitle} visible={visible} onCancel={closeModal} onOk={handleOk}>
      <Form>
        <Form.Item label="name">
          {form.getFieldDecorator('name', {
            initialValue: !!initValue ? initValue.name : undefined,
          })(<Input placeholder="Please input name"></Input>)}
        </Form.Item>
      </Form>
    </Modal>
  );
};

const CreateEditModal = Form.create<CreateEditModalProps>()(_CreateEditModal);

const Demo = () => {
  const sampleModal = useModal();
  const createEditModal = useModal<Person>();
  const [personList, setPersonList] = React.useState<string[]>([]);
  const addPerson = (name: string) => {
    setPersonList(o => {
      return [...o, name];
    });
  };

  const editPerson = (index: number, name: string) => {
    setPersonList(o => {
      const result = [...o];
      result[index] = name;
      return result;
    });
  };

  return (
    <div className="demo">
      <Card title="Sample Modal" style={{ marginBottom: 10 }}>
        <Button onClick={() => sampleModal.openModal()}>Open Sample Modal</Button>
        <SampleModal {...sampleModal}></SampleModal>
      </Card>

      <Card title="CreateEditModal">
        <Table
          style={{ marginBottom: 10 }}
          columns={[
            {
              title: 'index',
              dataIndex: 'index',
            },
            {
              title: 'name',
              dataIndex: 'name',
            },
            {
              title: 'Edit',
              render: (p: Person) => (
                <Button onClick={() => createEditModal.openModal(p)}>Edit</Button>
              ),
            },
          ]}
          dataSource={personList.map((name, index) => ({
            index,
            name,
          }))}
        />
        <Button onClick={() => createEditModal.openModal()}>Add Person</Button>
        <CreateEditModal {...createEditModal} addPerson={addPerson} editPerson={editPerson} />
      </Card>
    </div>
  );
};

export default Demo;
