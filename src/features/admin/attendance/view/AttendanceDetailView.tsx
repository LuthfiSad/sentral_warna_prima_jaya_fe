import AdminNavbar from "@features/admin/components/AdminNavbar";
import React from "react";
import { AttendanceDetailContent } from "../components/AttendanceDetailContent";

const AttendanceDetailView: React.FC = () => {
  return (
    <>
      <AdminNavbar page="Detail Absensi" />
      <div className="page-content">
        <AttendanceDetailContent />
      </div>
    </>
  );
};

export default AttendanceDetailView;