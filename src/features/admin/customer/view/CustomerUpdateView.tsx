import React from "react";
import AdminNavbar from "@features/admin/components/AdminNavbar";
import { CustomerFormUpdate } from "../components/CustomerFormUpdate";

const CustomerUpdateView: React.FC = () => {
  return (
    <>
      <AdminNavbar page="Ubah Customer" />
      <div className="page-content">
        <CustomerFormUpdate />
      </div>
    </>
  );
};

export default CustomerUpdateView;
