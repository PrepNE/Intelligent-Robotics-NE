import RegisterForm from '@/components/forms/RegisterForm'
import AuthLayout from '@/layout/AuthLayout'
import React from 'react'

const Register = () => {
  return (
    <AuthLayout>
        <RegisterForm />
    </AuthLayout>
  )
}

export default Register