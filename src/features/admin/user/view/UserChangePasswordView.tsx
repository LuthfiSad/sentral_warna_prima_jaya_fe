import React from "react";
import AdminNavbar from "@features/admin/components/AdminNavbar";
import { UserFormUpdatePassword } from "../components/UserFormUpdatePassword";

const UserChangePasswordView: React.FC = () => {
  return (
    <>
      <AdminNavbar page="Ubah Password" />
      <div className="page-content">
        <UserFormUpdatePassword />
      </div>
    </>
  );
};

export default UserChangePasswordView;
