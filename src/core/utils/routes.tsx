import { DashboardView } from "@features/admin/dashboard/view/DashboardView";
import EmployeeAddView from "@features/admin/employee/view/EmployeeAddView";
import EmployeeUpdateView from "@features/admin/employee/view/EmployeeUpdateView";
import { EmployeeView } from "@features/admin/employee/view/EmployeeView";
import UserAddView from "@features/admin/user/view/UserAddView";
import UserUpdateView from "@features/admin/user/view/UserUpdateView";
import { UserView } from "@features/admin/user/view/UserView";
import AdminView from "@features/admin/view/Admin";
import LoginView from "@features/auth/view/LoginView";
import RegisterView from "@features/auth/view/RegisterView";
import { createBrowserRouter } from "react-router-dom";

export const allRoutes = [
  {
    path: "/",
    element: <DashboardView />,
    role: ["ADMIN", "KARYAWAN"],
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
    path: "/employee",
    element: <EmployeeView />,
    role: ["ADMIN"],
  },
  {
    path: "/employee/create",
    element: <EmployeeAddView />,
    role: ["ADMIN"],
  },
  {
    path: "/employee/edit/:id",
    element: <EmployeeUpdateView />,
    role: ["ADMIN"],
  },
];

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginView />,
  },
  {
    path: "/register",
    element: <RegisterView />,
  },
  {
    path: "/",
    element: <AdminView />,
    children: allRoutes,
  },
]);
