import AdminNavbar from "@features/admin/components/AdminNavbar";
import React from "react";
import { InventoryContent } from "../components/InventoryContent";

export const InventoryView: React.FC = () => {
  return (
    <>
      <AdminNavbar page="List Inventory" />
      <div className="page-content">
        <InventoryContent />
      </div>
    </>
  );
};
