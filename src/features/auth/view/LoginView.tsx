
import React from "react"
import AuthLayout from "../containers/AuthLayout"
import Login from "../components/Login"

const LoginView: React.FC = () => {
  return (
    <AuthLayout>
      <Login />
    </AuthLayout>
  )
}

export default LoginView