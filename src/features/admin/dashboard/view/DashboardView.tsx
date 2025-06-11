import AdminNavbar from "@features/admin/components/AdminNavbar";
import React from "react";
import { DashboardContent } from "../components/DashboardContent";

const DashboardView: React.FC = () => {
  return (
    <>
      <AdminNavbar page="Dashboard" />
      <div className="page-content">
        <DashboardContent />
      </div>
    </>
  );
};

export default DashboardView;