import React from "react";
import AdminNavbar from "@features/admin/components/AdminNavbar";
import { ReportFormAdd } from "../components/ReportFormAdd";

const ReportAddView: React.FC = () => {
  return (
    <>
      <AdminNavbar page="Tambah Report" />
      <div className="page-content">
        <ReportFormAdd />
      </div>
    </>
  );
};

export default ReportAddView;
