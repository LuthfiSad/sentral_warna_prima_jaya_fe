import React from "react";
import AdminNavbar from "@features/admin/components/AdminNavbar";
import { StbFormAdd } from "../components/StbFormAdd";

const StbAddView: React.FC = () => {
  return (
    <>
      <AdminNavbar page="Tambah Set Top Box" />
      <div className="page-content">
        <StbFormAdd />
      </div>
    </>
  );
};

export default StbAddView;
