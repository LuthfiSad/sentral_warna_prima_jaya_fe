import LocationAddView from "@features/admin/localton/view/LocationAddView";
import LocationUpdateView from "@features/admin/localton/view/LocationUpdateView";
import { LocationView } from "@features/admin/localton/view/LocationView";
import OntAddView from "@features/admin/opticalNetworkTerminal/view/OntAddView";
import { OntView } from "@features/admin/opticalNetworkTerminal/view/OntView";
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
        path: "/admin/ont/:locationId",
        element: <OntView />,
      },
      // {
      //   path: "/admin/anggota/edit/:id",
      //   element: <EditAnggotaView />,
      // },
    ],
  },
]);
