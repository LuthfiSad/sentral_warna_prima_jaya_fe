import AdminNavbar from "@features/admin/components/AdminNavbar";
import React from "react";
import { EmployeeContent } from "../components/EmployeeContent";

export const EmployeeView: React.FC = () => {
  return (
    <>
      <AdminNavbar page="Data Karyawan" />
      <div className="page-content">
        <EmployeeContent />
      </div>
    </>
  );
};
