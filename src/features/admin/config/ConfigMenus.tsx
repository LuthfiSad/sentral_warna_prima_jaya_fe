import { FaUser } from "react-icons/fa";
import { ItemMenuAdmin } from "../../_global/types/MenuTypes";

export const CONFIG_MENU_ADMIN: ItemMenuAdmin[] = [
  {
    icon: <FaUser />,
    name: "Location",
    to: "/admin/location",
  },
  {
    icon: <FaUser />,
    name: "Cable",
    to: "/admin/cable",
  },
  {
    icon: <FaUser />,
    name: "Optical Network Terminal",
    to: "/admin/ont",
  },
  {
    icon: <FaUser />,
    name: "Set Top Box",
    to: "/admin/stb",
  },
  {
    icon: <FaUser />,
    name: "Inventory",
    to: "/admin/inventory",
  },
];
