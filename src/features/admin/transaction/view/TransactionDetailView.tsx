import AdminNavbar from "@features/admin/components/AdminNavbar";
import React from "react";
import { TransactionDetail } from "../components/TransactionDetail";

const TransactionDetailView: React.FC = () => {
  return (
    <>
      <AdminNavbar page="Data Karyawan" />
      <div className="page-content">
        <TransactionDetail />
      </div>
    </>
  );
};

export default TransactionDetailView;