import React from "react";
import AdminNavbar from "@features/admin/components/AdminNavbar";
import { TransactionFormUpdate } from "../components/TransactionFormUpdate";

const TransactionUpdateView: React.FC = () => {
  return (
    <>
      <AdminNavbar page="Ubah Karyawan" />
      <div className="page-content">
        <TransactionFormUpdate />
      </div>
    </>
  );
};

export default TransactionUpdateView;
