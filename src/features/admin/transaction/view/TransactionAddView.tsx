import React from "react";
import AdminNavbar from "@features/admin/components/AdminNavbar";
import { TransactionFormAdd } from "../components/TransactionFormAdd";

const TransactionAddView: React.FC = () => {
  return (
    <>
      <AdminNavbar page="Tambah Karyawan" />
      <div className="page-content">
        <TransactionFormAdd />
      </div>
    </>
  );
};

export default TransactionAddView;
