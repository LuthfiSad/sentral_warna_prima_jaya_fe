import AdminNavbar from "@features/admin/components/AdminNavbar";
import React from "react";
import { StbContent } from "../components/StbContent";

export const StbView: React.FC = () => {
  return (
    <>
      <AdminNavbar page="Data Set Top Box" />
      <div className="page-content">
        <StbContent />
      </div>
    </>
  );
};
