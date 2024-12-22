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
    name: "Optical Network Terminal",
    to: "/admin/ont",
  },
];
