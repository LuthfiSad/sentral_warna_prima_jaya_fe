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
import AdminView from "@features/admin/view/Admin";
import LoginView from "@features/auth/view/LoginView";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginView />,
  },
  {
    path: "/",
    element: <AdminView />,
    children: [
      {
        path: "/",
        element: <DashboardView />,
      },
      {
        path: "/location",
        element: <LocationView />,
      },
      {
        path: "/location/create",
        element: <LocationAddView />,
      },
      {
        path: "/location/edit/:id",
        element: <LocationUpdateView />,
      },
      {
        path: "/ont",
        element: <OntView />,
      },
      {
        path: "/ont/create",
        element: <OntAddView />,
      },
      {
        path: "/ont/edit/:id",
        element: <OntUpdateView />,
      },
      {
        path: "/ont/:locationId",
        element: <OntView />,
      },
      {
        path: "/stb",
        element: <StbView />,
      },
      {
        path: "/stb/create",
        element: <StbAddView />,
      },
      {
        path: "/stb/edit/:id",
        element: <StbUpdateView />,
      },
      {
        path: "/stb/:locationId",
        element: <StbView />,
      },
      {
        path: "/cable",
        element: <CableView />,
      },
      {
        path: "/cable/edit/:id",
        element: <CableUpdateView />,
      },
      {
        path: "/cable/:locationId",
        element: <CableView />,
      },
      {
        path: "/inventory",
        element: <InventoryView />,
      },
      {
        path: "/inventory/create",
        element: <InventoryAddView />,
      },
      {
        path: "/inventory/edit/:id",
        element: <InventoryUpdateView />,
      },
    ],
  },
]);
