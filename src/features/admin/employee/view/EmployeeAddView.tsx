import React from "react";
import AdminNavbar from "@features/admin/components/AdminNavbar";
import { EmployeeFormAdd } from "../components/EmployeeFormAdd";

const EmployeeAddView: React.FC = () => {
  return (
    <>
      <AdminNavbar page="Tambah Karyawan" />
      <div className="page-content">
        <EmployeeFormAdd />
      </div>
    </>
  );
};

export default EmployeeAddView;
