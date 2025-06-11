import {
  FaUserCircle,
} from "react-icons/fa";
import { ItemMenuAdmin } from "../../_global/types/MenuTypes";
import { FaUser, FaWindows } from "react-icons/fa6";

export const CONFIG_MENU_ADMIN: ItemMenuAdmin[] = [
  {
    icon: <FaWindows />,
    name: "Dashboard",
    to: "/",
  },
  {
    icon: <FaUser />,
    name: "Manajemen User",
    to: "/user",
  },
  {
    icon: <FaUserCircle />,
    name: "Manajemen Karyawan",
    to: "/employee",
  },
  {
    icon: <FaWindows />,
    name: "Report",
    to: "/report",
  }
];
