import React from "react";
import AdminNavbar from "@features/admin/components/AdminNavbar";
import { LocationFormUpdate } from "../components/LocationFormUpdate";

const LocationUpdateView: React.FC = () => {
  return (
    <>
      <AdminNavbar page="Update Location" />
      <div className="page-content">
        <LocationFormUpdate />
      </div>
    </>
  );
};

export default LocationUpdateView;
