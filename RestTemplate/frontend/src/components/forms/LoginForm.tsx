/* eslint-disable @typescript-eslint/no-explicit-any */
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Typography } from "antd";
import { useForm } from "antd/es/form/Form";
import Link from "antd/es/typography/Link";
import FormInput from "../shared/FormInput";
import useAuth from "@/hooks/useAuth";

const LoginForm = () => {
  const { Text, Title } = Typography;
  const [form] = useForm();
  const { login } = useAuth();

  const handleKeyDownPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === ' ') {
        event.preventDefault();
        return false;
    }
}
const handleOnFinish = async (values: { email: string; password: string }) => {
    await login(values.email, values.password);
  };

  return (
    <div className="border border-gray-300 rounded-md p-6 max-w-md shadow-[0_2px_22px_-4px_rgba(93,96,127,0.2)] max-md:mx-auto">
      <Form
        name="normal_login"
        onFinish={handleOnFinish}
        layout="vertical"
        requiredMark
        className="space-y-6"
        form={form}
      >
        <div className="mb-10">
          <Title className="text-3xl font-extrabold">Sign in</Title>
          <Text className="text-sm mt-4">
            Sign in to your account and explore a world of possibilities. Your
            journey begins here.
          </Text>
        </div>

        <FormInput
          name="email"
          label="E-mail"
          type="email"
          placeholder="Enter your email"
          prefix={<MailOutlined />}
          rules={[
            {
              type: "email",
              required: true,
              message: "Please input your email!",
            },
          ]}
        />

        <FormInput
          name="password"
          label="Password"
          type="password"
          placeholder="Password"
          prefix={<LockOutlined />}
          onKeyDown={handleKeyDownPress}
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
            {
              min: 6,
              message: "Password must be at least 6 characters long!",
            },
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
            Log in
          </Button>
        </Form.Item>

        <Text className="text-sm text-center block mt-2">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-green-600 hover:underline ml-1 whitespace-nowrap"
          >
            Register here
          </Link>
        </Text>
      </Form>
    </div>
  );
};

export default LoginForm;