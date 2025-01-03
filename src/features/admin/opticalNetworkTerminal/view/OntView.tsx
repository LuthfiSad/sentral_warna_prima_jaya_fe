import AdminNavbar from "@features/admin/components/AdminNavbar";
import React from "react";
import { OntContent } from "../components/OntContent";

export const OntView: React.FC = () => {
  return (
    <>
      <AdminNavbar page="Data Optical Network Terminal" />
      <div className="page-content">
        <OntContent />
      </div>
    </>
  );
};
