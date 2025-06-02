/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { ReactNode } from 'react'
import { Form , Input } from "antd";


interface FormInputProps {
    name: string;
    label: string;
    prefix?:ReactNode;
    placeholder?: string;
    type?: "text" | "password" | "email";
    rules?: any[];
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const FormInput = ({
    name,
    label,
    prefix,
    placeholder,
    type="text",
    rules,
    onKeyDown
}: FormInputProps) => {
    const inputProps = {
        prefix,
        placeholder,
        className: "py-3",
        onKeyDown

    }
  return (
    <Form.Item name={name} label={label} rules={rules}>
        { type === "password" ? (
            <Input.Password {...inputProps}/>
        ): (
            <Input {...inputProps} type={type} />
        )}
    </Form.Item>
  )
}

export default FormInput