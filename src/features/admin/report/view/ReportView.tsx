import AdminNavbar from "@features/admin/components/AdminNavbar";
import React from "react";
import { ReportContent } from "../components/ReportContent";

const ReportView: React.FC = () => {
  return (
    <>
      <AdminNavbar page="Data Report" />
      <div className="page-content">
        <ReportContent />
      </div>
    </>
  );
};

export default ReportView;
