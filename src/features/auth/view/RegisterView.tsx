
import React from "react"
import AuthLayout from "../containers/AuthLayout"
import Register from "../components/Register"

const RegisterView: React.FC = () => {
  return (
    <AuthLayout title="Register">
      <Register />
    </AuthLayout>
  )
}

export default RegisterView