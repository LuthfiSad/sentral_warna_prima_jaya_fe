import React from "react";
import AdminNavbar from "@features/admin/components/AdminNavbar";
import { OntFormUpdate } from "../components/OntFormUpdate";

const OntUpdateView: React.FC = () => {
  return (
    <>
      <AdminNavbar page="Ubah Optical Network Terminal" />
      <div className="page-content">
        <OntFormUpdate />
      </div>
    </>
  );
};

export default OntUpdateView;
