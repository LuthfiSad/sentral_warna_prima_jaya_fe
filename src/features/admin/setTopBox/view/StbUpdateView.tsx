import React from "react";
import AdminNavbar from "@features/admin/components/AdminNavbar";
import { StbFormUpdate } from "../components/StbFormUpdate";

const StbUpdateView: React.FC = () => {
  return (
    <>
      <AdminNavbar page="Update Set Top Box" />
      <div className="page-content">
        <StbFormUpdate />
      </div>
    </>
  );
};

export default StbUpdateView;
