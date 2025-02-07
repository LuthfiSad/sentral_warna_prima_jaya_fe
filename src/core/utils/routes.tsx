import CableUpdateView from "@features/admin/cable/view/CableUpdateView";
import { CableView } from "@features/admin/cable/view/CableView";
import { DashboardView } from "@features/admin/dashboard/view/DashboardView";
import InventoryAddView from "@features/admin/inventory/view/InventoryAddView";
import InventoryUpdateView from "@features/admin/inventory/view/InventoryUpdateView";
import { InventoryView } from "@features/admin/inventory/view/InventoryView";
import LocationAddView from "@features/admin/location/view/LocationAddView";
import LocationUpdateView from "@features/admin/location/view/LocationUpdateView";
import { LocationView } from "@features/admin/location/view/LocationView";
import OntAddView from "@features/admin/opticalNetworkTerminal/view/OntAddView";
import OntUpdateView from "@features/admin/opticalNetworkTerminal/view/OntUpdateView";
import { OntView } from "@features/admin/opticalNetworkTerminal/view/OntView";
import StbAddView from "@features/admin/setTopBox/view/StbAddView";
import StbUpdateView from "@features/admin/setTopBox/view/StbUpdateView";
import { StbView } from "@features/admin/setTopBox/view/StbView";
import UserAddView from "@features/admin/user/view/UserAddView";
import UserChangePasswordView from "@features/admin/user/view/UserChangePasswordView";
import UserUpdateView from "@features/admin/user/view/UserUpdateView";
import { UserView } from "@features/admin/user/view/UserView";
import AdminView from "@features/admin/view/Admin";
import LoginView from "@features/auth/view/LoginView";
import { createBrowserRouter } from "react-router-dom";

export const allRoutes = [
  {
    path: "/",
    element: <DashboardView />,
    role: ["USER", "LEADER"],
  },
  {
    path: "/location",
    element: <LocationView />,
    role: ["USER", "LEADER"],
  },
  {
    path: "/location/create",
    element: <LocationAddView />,
    role: ["USER"],
  },
  {
    path: "/location/edit/:id",
    element: <LocationUpdateView />,
    role: ["USER"],
  },
  {
    path: "/ont",
    element: <OntView />,
    role: ["USER", "LEADER"],
  },
  {
    path: "/ont/create",
    element: <OntAddView />,
    role: ["USER"],
  },
  {
    path: "/ont/edit/:id",
    element: <OntUpdateView />,
    role: ["USER"],
  },
  {
    path: "/ont/:locationId",
    element: <OntView />,
    role: ["USER", "LEADER"],
  },
  {
    path: "/stb",
    element: <StbView />,
    role: ["USER", "LEADER"],
  },
  {
    path: "/stb/create",
    element: <StbAddView />,
    role: ["USER"],
  },
  {
    path: "/stb/edit/:id",
    element: <StbUpdateView />,
    role: ["USER"],
  },
  {
    path: "/stb/:locationId",
    element: <StbView />,
    role: ["USER", "LEADER"],
  },
  {
    path: "/cable",
    element: <CableView />,
    role: ["USER", "LEADER"],
  },
  {
    path: "/cable/edit/:id",
    element: <CableUpdateView />,
    role: ["USER"],
  },
  {
    path: "/cable/:locationId",
    element: <CableView />,
    role: ["USER", "LEADER"],
  },
  {
    path: "/inventory",
    element: <InventoryView />,
    role: ["USER", "LEADER"],
  },
  {
    path: "/inventory/create",
    element: <InventoryAddView />,
    role: ["USER"],
  },
  {
    path: "/inventory/edit/:id",
    element: <InventoryUpdateView />,
    role: ["USER"],
  },
  {
    path: "/user",
    element: <UserView />,
    role: ["ADMIN"],
  },
  {
    path: "/user/create",
    element: <UserAddView />,
    role: ["ADMIN"],
  },
  {
    path: "/user/edit/:id",
    element: <UserUpdateView />,
    role: ["ADMIN"],
  },
  {
    path: "/user/change/:id",
    element: <UserChangePasswordView />,
    role: ["ADMIN"],
  },
];

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginView />,
  },
  {
    path: "/",
    element: <AdminView />,
    children: allRoutes,
  },
]);
