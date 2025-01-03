import React from "react";
import AdminNavbar from "@features/admin/components/AdminNavbar";
import { LocationFormAdd } from "../components/LocationFormAdd";

const LocationAddView: React.FC = () => {
  return (
    <>
      <AdminNavbar page="Tambah Lokasi" />
      <div className="page-content">
        <LocationFormAdd />
      </div>
    </>
  );
};

export default LocationAddView;
