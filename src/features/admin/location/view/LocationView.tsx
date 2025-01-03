import AdminNavbar from "@features/admin/components/AdminNavbar";
import React from "react";
import { LocationContent } from "../components/LocationContent";

export const LocationView: React.FC = () => {
  return (
    <>
      <AdminNavbar page="Data Lokasi" />
      <div className="page-content">
        <LocationContent />
      </div>
    </>
  );
};
