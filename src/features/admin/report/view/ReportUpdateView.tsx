import React from "react";
import AdminNavbar from "@features/admin/components/AdminNavbar";
import { ReportFormUpdate } from "../components/ReportFormUpdate";

const ReportUpdateView: React.FC = () => {
  return (
    <>
      <AdminNavbar page="Ubah Report" />
      <div className="page-content">
        <ReportFormUpdate />
      </div>
    </>
  );
};

export default ReportUpdateView;
