import AdminNavbar from "@features/admin/components/AdminNavbar";
import React from "react";
import { HistoryContent } from "../components/HistoryContent";

const HistoryView: React.FC = () => {
  return (
    <>
      <AdminNavbar page="Data Karyawan" />
      <div className="page-content">
        <HistoryContent />
      </div>
    </>
  );
};

export default HistoryView;