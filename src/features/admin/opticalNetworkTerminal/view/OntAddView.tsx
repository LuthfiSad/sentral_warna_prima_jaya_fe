import React from "react";
import AdminNavbar from "@features/admin/components/AdminNavbar";
import { OntFormAdd } from "../components/OntFormAdd";

const OntAddView: React.FC = () => {
  return (
    <>
      <AdminNavbar page="Add Optical Network Terminal" />
      <div className="page-content">
        <OntFormAdd />
      </div>
    </>
  );
};

export default OntAddView;
