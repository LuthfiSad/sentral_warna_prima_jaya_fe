import AdminNavbar from "@features/admin/components/AdminNavbar";
import React from "react";
import { CustomerDetail } from "../components/CustomerDetail";

const CustomerDetailView: React.FC = () => {
  return (
    <>
      <AdminNavbar page="Data Customer" />
      <div className="page-content">
        <CustomerDetail />
      </div>
    </>
  );
};

export default CustomerDetailView;