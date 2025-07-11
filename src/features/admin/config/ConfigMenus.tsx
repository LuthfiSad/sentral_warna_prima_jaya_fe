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

export const CONFIG_MENU_PERSONALIA: ItemMenuAdmin[] = [
  {
    icon: <FaWindows />,
    name: "Dashboard",
    to: "/",
    role: ["PERSONALIA", "KARYAWAN"],
  },
  {
    icon: <FaUser />,
    name: "Manajemen User",
    to: "/dashboard/user",
    role: ["PERSONALIA"],
  },
  {
    icon: <FaUserCircle />,
    name: "Manajemen Karyawan",
    to: "/dashboard/employee",
    role: ["PERSONALIA"],
  },
  {
    icon: <FaCar />,
    name: "Customer",
    to: "/dashboard/customer",
    role: ["PERSONALIA"],
  },
  {
    icon: <FaExchangeAlt />,
    name: "Transaksi",
    to: "/dashboard/transaction",
    role: ["PERSONALIA", "KARYAWAN"],
  },
  {
    icon: <FaFileAlt />,
    name: "Laporan",
    to: "/dashboard/report",
    role: ["PERSONALIA", "KARYAWAN"],
  },
  {
    icon: <FaHistory />,
    name: "History",
    to: "/dashboard/history",
    role: ["PERSONALIA"],
  },
  {
    icon: <FaPlug />,
    name: "Absensi",
    to: "/dashboard/attendance",
    role: ["PERSONALIA", "KARYAWAN"],
  }
];