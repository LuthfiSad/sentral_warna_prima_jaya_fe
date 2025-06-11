import React from "react";
import AdminNavbar from "@features/admin/components/AdminNavbar";
import { EmployeeFormUpdate } from "../components/EmployeeFormUpdate";

const EmployeeUpdateView: React.FC = () => {
  return (
    <>
      <AdminNavbar page="Ubah Karyawan" />
      <div className="page-content">
        <EmployeeFormUpdate />
      </div>
    </>
  );
};

export default EmployeeUpdateView;
