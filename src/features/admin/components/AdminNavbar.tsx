import React from "react";

const AdminNavbar: React.FC<{
  page: string;
}> = ({ page }) => {
  return (
    <div className="page-heading">
      <h3 className="text-2xl">{page}</h3>
    </div>
  );
};

export default AdminNavbar;
