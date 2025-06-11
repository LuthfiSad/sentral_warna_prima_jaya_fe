import AdminNavbar from "@features/admin/components/AdminNavbar";
import React from "react";
import { EmployeeContent } from "../components/EmployeeContent";

const EmployeeView: React.FC = () => {
  return (
    <>
      <AdminNavbar page="Data Karyawan" />
      <div className="page-content">
        <EmployeeContent />
      </div>
    </>
  );
};

export default EmployeeView;