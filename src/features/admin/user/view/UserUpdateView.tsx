import React from "react";
import AdminNavbar from "@features/admin/components/AdminNavbar";
import { UserFormUpdate } from "../components/UserFormUpdate";

const UserUpdateView: React.FC = () => {
  return (
    <>
      <AdminNavbar page="Ubah User" />
      <div className="page-content">
        <UserFormUpdate />
      </div>
    </>
  );
};

export default UserUpdateView;
