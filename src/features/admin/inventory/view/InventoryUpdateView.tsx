import React from "react";
import AdminNavbar from "@features/admin/components/AdminNavbar";
import { InventoryFormUpdate } from "../components/InventoryFormUpdate";

const InventoryUpdateView: React.FC = () => {
  return (
    <>
      <AdminNavbar page="Ubah Inventaris" />
      <div className="page-content">
        <InventoryFormUpdate />
      </div>
    </>
  );
};

export default InventoryUpdateView;
