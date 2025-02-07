import AdminNavbar from "@features/admin/components/AdminNavbar";
import React from "react";
import { UserContent } from "../components/UserContent";

export const UserView: React.FC = () => {
  return (
    <>
      <AdminNavbar page="Data User" />
      <div className="page-content">
        <UserContent />
      </div>
    </>
  );
};
