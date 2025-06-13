import {
  FaPlug,
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
    to: "/dashboard/user",
  },
  {
    icon: <FaUserCircle />,
    name: "Manajemen Karyawan",
    to: "/dashboard/employee",
  },
  {
    icon: <FaWindows />,
    name: "Report",
    to: "/dashboard/report",
  },
  {
    icon: <FaPlug />,
    name: "Absensi",
    to: "/dashboard/attendance",
  }
];
