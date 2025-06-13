import AdminNavbar from "@features/admin/components/AdminNavbar";
import React from "react";
import { AttendanceContent } from "../components/AttendanceContent";

const AttendanceView: React.FC = () => {
  return (
    <>
      <AdminNavbar page="Data Absensi" />
      <div className="page-content">
        <AttendanceContent />
      </div>
    </>
  );
};

export default AttendanceView;