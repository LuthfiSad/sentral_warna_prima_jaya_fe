import {
  FaPlug,
  FaUserCircle,
  FaCar,
  FaFileAlt,
  FaExchangeAlt,
  FaHistory,
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
    icon: <FaCar />,
    name: "Customer",
    to: "/dashboard/customer",
    role: ["ADMIN"],
  },
  {
    icon: <FaExchangeAlt />,
    name: "Transaksi",
    to: "/dashboard/transaction",
    role: ["ADMIN", "KARYAWAN"],
  },
  {
    icon: <FaFileAlt />,
    name: "Laporan",
    to: "/dashboard/report",
    role: ["ADMIN", "KARYAWAN"],
  },
  {
    icon: <FaHistory />,
    name: "History",
    to: "/dashboard/history",
    role: ["ADMIN"],
  },
  {
    icon: <FaPlug />,
    name: "Absensi",
    to: "/dashboard/attendance",
    role: ["ADMIN", "KARYAWAN"],
  }
];