import CableUpdateView from "@features/admin/cable/view/CableUpdateView";
import { CableView } from "@features/admin/cable/view/CableView";
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
    path: "/admin/login",
    element: <LoginView />,
  },
  {
    path: "/",
    element: <AdminView />,
    children: [
      {
        path: "/admin/location",
        element: <LocationView />,
      },
      {
        path: "/admin/location/create",
        element: <LocationAddView />,
      },
      {
        path: "/admin/location/edit/:id",
        element: <LocationUpdateView />,
      },
      {
        path: "/admin/ont",
        element: <OntView />,
      },
      {
        path: "/admin/ont/create",
        element: <OntAddView />,
      },
      {
        path: "/admin/ont/edit/:id",
        element: <OntUpdateView />,
      },
      {
        path: "/admin/ont/:locationId",
        element: <OntView />,
      },
      {
        path: "/admin/stb",
        element: <StbView />,
      },
      {
        path: "/admin/stb/create",
        element: <StbAddView />,
      },
      {
        path: "/admin/stb/edit/:id",
        element: <StbUpdateView />,
      },
      {
        path: "/admin/stb/:locationId",
        element: <StbView />,
      },
      {
        path: "/admin/cable",
        element: <CableView />,
      },
      {
        path: "/admin/cable/edit/:id",
        element: <CableUpdateView />,
      },
      {
        path: "/admin/cable/:locationId",
        element: <CableView />,
      },
      {
        path: "/admin/inventory",
        element: <InventoryView />,
      },
      {
        path: "/admin/inventory/create",
        element: <InventoryAddView />,
      },
      {
        path: "/admin/inventory/edit/:id",
        element: <InventoryUpdateView />,
      },
    ],
  },
]);
