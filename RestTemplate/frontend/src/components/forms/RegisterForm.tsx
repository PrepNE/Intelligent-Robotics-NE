/* eslint-disable @typescript-eslint/no-explicit-any */

import { useForm } from "antd/es/form/Form";
import { Button, Form, Typography } from "antd";
import FormInput from "@/components/shared/FormInput";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import useAuth from "@/hooks/useAuth";

const RegisterForm = () => {
  const { Text, Title } = Typography;
  const [form] = useForm();
  const { register } = useAuth()

  const onSubmit = async () => {
    form.validateFields()
    .then(async (values) => {
        await register(values);
    })
    .catch(info => {
        console.log('Validate Failed:', info);
    });
  };
  return (
    <div className="border border-gray-300 rounded-md p-6 max-w-md shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-md:mx-auto">
      <Form
        name="normal_Login"
        onFinish={onSubmit}
        layout="vertical"
        requiredMark
        className="space-y-6"
        form={form}
      >
        <div>
          <Title className="text-3xl font-extrabold">Register</Title>
          <Text className="text-sm mt-4">
            Create a student account and explore a world of possibilities. Your
            journey begins here.
          </Text>
        </div>

        <FormInput
          name="firstName"
          label="First Name"
          placeholder="Enter your first name"
          prefix={<UserOutlined />}
          rules={[{ required: true, message: "Please input your first name!" }]}
        />
        <FormInput
          name="lastName"
          label="Last Name"
          placeholder="Enter your last name"
          prefix={<UserOutlined />}
          rules={[{ required: true, message: "Please input your last name!" }]}
        />

        <FormInput
          name="email"
          label="Email"
          placeholder="Enter your email"
          prefix={<MailOutlined />}
          rules={[
            {
              required: true,
              type: "email",
              message: "Please enter a valid email!",
            },
          ]}
        />

        <FormInput
          name="password"
          label="password"
          type="password"
          placeholder="Create a password"
          prefix={<LockOutlined />}
          rules={[
            { required: true, message: "Please input your password!" },
            { min: 6, message: "Password must be at least 6 characters long!" },
            {
              pattern: /^(?=.*[a-z]).{6,}$/,
              message: "Password must contain at least one letter!",
            },
          ]}
        />

        <Form.Item className="!mt-10">
          <Button
            block
            type="primary"
            htmlType="submit"
            className="w-full shadow-xl px-4 text-sm font-semibold rounded py-6 text-white bg-primary hover:bg-green-400 focus:outline-none"
          >
            Register
          </Button>
        </Form.Item>

        <Text className="text-sm !mt-10 text-center">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-green-600 hover:underline ml-1 whitespace-nowrap"
          >
            Sign in
          </a>
        </Text>
      </Form>
    </div>
  );
};

export default RegisterForm;