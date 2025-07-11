import AdminNavbar from "@features/admin/components/AdminNavbar";
import React from "react";
import { TransactionContent } from "../components/TransactionContent";

const TransactionView: React.FC = () => {
  return (
    <>
      <AdminNavbar page="Data Karyawan" />
      <div className="page-content">
        <TransactionContent />
      </div>
    </>
  );
};

export default TransactionView;