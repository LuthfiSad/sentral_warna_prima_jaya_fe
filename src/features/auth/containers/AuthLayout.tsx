import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import bg_login from "@core/assets/login.jpg";
import logo from "@core/assets/logo_bg_remove.png";

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();

  if (auth?.data) {
    return <Navigate to={"/anggota"} replace />;
  }

  return (
    <section
      className="relative flex flex-col min-h-screen justify-center items-center w-full bg-cover bg-center"
      style={{ backgroundImage: `url(${bg_login})` }}
    >
      <img src={logo} className="w-[200px] mb-4 shadow-2xl" alt="Logo" />
      <div className="card mx-3 bg-[rgba(0,0,0,0.8)] shadow-2xl">
        <div className="card-header py-3 bg-transparent flex flex-col items-center">
          <h4 className="card-title text-center">Log in</h4>
        </div>
        <div className="card-content">
          <div className="card-body max-w-md pt-0">{children}</div>
        </div>
      </div>
    </section>
  );
};

export default AuthLayout;
