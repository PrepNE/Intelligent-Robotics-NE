/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Form, Input, InputNumber, Modal, Typography } from 'antd';
import React, { useEffect } from 'react';


const { Text } = Typography;


interface EditModalProps<T> {
    visible: boolean;
    onClose: () => void;
    item: T | null;
    title: string;
    fields: {
        name: keyof T;
        label: string;
        inputType?: 'text' | "number" | "email";
        rules?: any[];
        placeholder?: string;
    }[];
    onSubmit: (updatedItem: T) => Promise<void>;
}

const EditModal = <T extends {id: string}>({
    visible,
    onClose,
    item,
    title,
    fields,
    onSubmit
}: EditModalProps<T>) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if(item){
            form.setFieldsValue(item);
        }
    },[item, form])

    const handleSubmit = () => {
        form.validateFields()
        .then(async(values) => {
            if(item){
                await onSubmit({...item, values});
            }
            form.resetFields();
            onClose();
        })
        .catch((info) => console.error("Validation Failed: ", info))
    }
  return (
    <Modal
      title={title}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>Cancel</Button>,
        <Button key="submit" type='primary' onClick={handleSubmit}>Save</Button>
      ]}
    >
        <Text>Edit the fields below: </Text>
        <Form form={form}  layout='vertical' className='pt-4' requiredMark>
            {fields.map(({ name , label , inputType="text", rules=[], placeholder}) => (
                <Form.Item
                 key={String(name)}
                 name={name as string}
                 label={label}
                 rules={rules}
                >
                    {inputType === "number" ? (
                        <InputNumber placeholder={placeholder} className='py-2' style={{ width: '100%'}} />
                    ): (
                        <Input placeholder={placeholder} className='py-2' />
                    )}
                </Form.Item>
            ))}
        </Form>
    </Modal>
  )
}

export default EditModal