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
    role: ["ADMIN", "KARYAWAN"],
  },
  {
    icon: <FaUser />,
    name: "Manajemen User",
    to: "/dashboard/user",
    role: ["ADMIN"],
  },
  {
    icon: <FaUserCircle />,
    name: "Manajemen Karyawan",
    to: "/dashboard/employee",
    role: ["ADMIN"],
  },
  {
    icon: <FaWindows />,
    name: "Report",
    to: "/dashboard/report",
    role: ["ADMIN", "KARYAWAN"],
  },
  {
    icon: <FaPlug />,
    name: "Absensi",
    to: "/dashboard/attendance",
    role: ["ADMIN", "KARYAWAN"],
  }
];
