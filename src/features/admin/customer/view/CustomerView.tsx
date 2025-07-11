import AdminNavbar from "@features/admin/components/AdminNavbar";
import React from "react";
import { CustomerContent } from "../components/CustomerContent";

const CustomerView: React.FC = () => {
  return (
    <>
      <AdminNavbar page="Data Customer" />
      <div className="page-content">
        <CustomerContent />
      </div>
    </>
  );
};

export default CustomerView;