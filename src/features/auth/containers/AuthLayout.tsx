import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();

  if (auth?.data) {
    return <Navigate to={"/anggota"} replace />;
  }

  return (
    <section className="relative flex min-h-screen justify-center items-center w-full">
      <div className="card mx-3">
        <div className="card-header">
          <h4 className="card-title text-center">Log in</h4>
        </div>
        <div className="card-content">
          <div className="card-body max-w-md">{children}</div>
        </div>
      </div>
    </section>
  );
};

export default AuthLayout;
