import React from "react";
import AdminNavbar from "@features/admin/components/AdminNavbar";
import { UserFormAdd } from "../components/UserFormAdd";

const UserAddView: React.FC = () => {
  return (
    <>
      <AdminNavbar page="Tambah User" />
      <div className="page-content">
        <UserFormAdd />
      </div>
    </>
  );
};

export default UserAddView;
