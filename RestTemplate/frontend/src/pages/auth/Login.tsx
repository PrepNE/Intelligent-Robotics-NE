import React from 'react'
import AuthLayout from '../../layout/AuthLayout'
import LoginForm from '@/components/forms/LoginForm'

const Login = () => {
  return (
    <AuthLayout>
        <LoginForm />
    </AuthLayout>
  )
}

export default Login