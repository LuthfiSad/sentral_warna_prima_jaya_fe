import { ItemMenuAdmin } from "@features/_global/types/MenuTypes";
import React from "react";
import { NavLink } from "react-router-dom";

const ItemSidenav: React.FC<ItemMenuAdmin> = ({ name, to, icon }) => {
  return (
    <NavLink to={to}>
      {({ isActive }) => (
        <li className={`sidebar-item ${isActive ? "active" : ""}`}>
          <div className="sidebar-link">
            {icon}
            <span>{name}</span>
          </div>
        </li>
      )}
    </NavLink>
  );
};

export default ItemSidenav;
