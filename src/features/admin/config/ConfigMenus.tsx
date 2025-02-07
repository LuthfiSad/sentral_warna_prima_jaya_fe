import {
  FaBox,
  FaMapMarkerAlt,
  FaNetworkWired,
  FaPlug,
  FaTv,
  FaUser,
  FaUserCircle,
} from "react-icons/fa";
import { ItemMenuAdmin } from "../../_global/types/MenuTypes";

export const CONFIG_MENU_ADMIN: ItemMenuAdmin[] = [
  {
    icon: <FaUser />,
    name: "Dashboard",
    to: "/",
  },
  {
    icon: <FaUserCircle />,
    name: "User Management",
    to: "/user",
  },
  {
    icon: <FaMapMarkerAlt />,
    name: "Lokasi",
    to: "/location",
  },
  {
    icon: <FaPlug />,
    name: "Kabel",
    to: "/cable",
  },
  {
    icon: <FaNetworkWired />,
    name: "Optical Network Terminal",
    to: "/ont",
  },
  {
    icon: <FaTv />,
    name: "Set Top Box",
    to: "/stb",
  },
  {
    icon: <FaBox />,
    name: "Inventaris",
    to: "/inventory",
  },
];
