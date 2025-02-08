// import { CONFIG_APP } from "@core/configs/app";
import { MenuAdminConfig } from "@features/_global/types/MenuTypes";
import React from "react";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
// import ItemSidenav from "./item";
import { IoMdLogOut } from "react-icons/io";
import ItemSidenav from "./item";
import logo from "@core/assets/logo.jpeg";

const Sidenav: React.FC<{
  Menus: MenuAdminConfig;
  openSidenav: boolean;
  setOpenSidenav: () => void;
  user: string;
}> = ({ Menus, openSidenav, setOpenSidenav, user }) => {
  const nav = useNavigate();
  return (
    <div id="sidebar">
      <div
        className={`sidebar-wrapper !bg-[#F7F7F7] ${
          openSidenav ? "!left-0" : ""
        }`}
      >
        <div className="sidebar-header pb-0 position-relative">
          <div className="d-flex justify-content-between align-items-center">
            <div className="logo w-full px-3">
              <img src={logo} className="w-full !h-auto" alt="Logo" srcSet="" />
            </div>
            <div className="sidebar-toggler x">
              <button
                onClick={() => setOpenSidenav()}
                className="sidebar-hide d-xl-none d-block"
              >
                <IoMdClose />
              </button>
            </div>
          </div>
        </div>
        <div className="sidebar-menu">
          <ul className="menu">
            <li className="sidebar-title text-center">{user}</li>
            <li className="sidebar-title">Menu</li>
            {Menus.map((item, index) => (
              <ItemSidenav {...item} key={index} />
            ))}
            <li className="sidebar-item">
              <button
                className="sidebar-link w-full"
                onClick={() => {
                  if (window.confirm("Are you sure you want to logout?")) {
                    localStorage.removeItem("token");
                    nav("/login");
                  }
                }}
              >
                <IoMdLogOut />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidenav;
