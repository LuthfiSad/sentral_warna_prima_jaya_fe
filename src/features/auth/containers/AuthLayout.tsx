import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
// import bg_login from "@core/assets/login.jpg";
// import logo from "@core/assets/logo_bg_remove.png";

const AuthLayout: React.FC<{ children: React.ReactNode; title?: string }> = ({
  children,
  title,
}) => {
  const auth = useAuth();

  if (auth?.data) {
    return <Navigate to={"/"} replace />;
  }

  return (
    <section
      className="relative flex flex-col min-h-screen bg-blue-300 justify-center items-center w-full bg-cover bg-center"
      // style={{ backgroundImage: `url(${bg_login})` }}
    >
      <h4 className="text-center font-bold text-5xl text-black uppercase mb-2">{title}</h4>
      <div className="p-5 mx-3 bg-[#D9D9D9] rounded-xl shadow-2xl">
        <div className="max-w-md pt-0">{children}</div>
      </div>
    </section>
  );
};

export default AuthLayout;
