import React from "react";
import AdminNavbar from "@features/admin/components/AdminNavbar";
import { CableFormUpdate } from "../components/CableFormUpdate";

const CableUpdateView: React.FC = () => {
  return (
    <>
      <AdminNavbar page="Ubah Kabel" />
      <div className="page-content">
        <CableFormUpdate />
      </div>
    </>
  );
};

export default CableUpdateView;
