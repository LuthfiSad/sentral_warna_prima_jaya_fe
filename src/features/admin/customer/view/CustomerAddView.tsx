import React from "react";
import AdminNavbar from "@features/admin/components/AdminNavbar";
import { CustomerFormAdd } from "../components/CustomerFormAdd";

const CustomerAddView: React.FC = () => {
  return (
    <>
      <AdminNavbar page="Tambah Customer" />
      <div className="page-content">
        <CustomerFormAdd />
      </div>
    </>
  );
};

export default CustomerAddView;
