import AttendanceDetailView from "@features/admin/attendance/view/AttendanceDetailView";
import AttendanceView from "@features/admin/attendance/view/AttendanceView";
import DashboardView from "@features/admin/dashboard/view/DashboardView";
import EmployeeAddView from "@features/admin/employee/view/EmployeeAddView";
import EmployeeUpdateView from "@features/admin/employee/view/EmployeeUpdateView";
import EmployeeView from "@features/admin/employee/view/EmployeeView";
import ReportAddView from "@features/admin/report/view/ReportAddView";
import ReportView from "@features/admin/report/view/ReportView";
import UserAddView from "@features/admin/user/view/UserAddView";
import UserUpdateView from "@features/admin/user/view/UserUpdateView";
import UserView from "@features/admin/user/view/UserView";
import AdminView from "@features/admin/view/Admin";
import AttendancePage from "@features/auth/components/Attendance";
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
    path: "/dashboard/user",
    element: <UserView />,
    role: ["ADMIN"],
  },
  {
    path: "/dashboard/user/create",
    element: <UserAddView />,
    role: ["ADMIN"],
  },
  {
    path: "/dashboard/user/edit/:id",
    element: <UserUpdateView />,
    role: ["ADMIN"],
  },
  {
    path: "/dashboard/employee",
    element: <EmployeeView />,
    role: ["ADMIN"],
  },
  {
    path: "/dashboard/employee/create",
    element: <EmployeeAddView />,
    role: ["ADMIN"],
  },
  {
    path: "/dashboard/employee/edit/:id",
    element: <EmployeeUpdateView />,
    role: ["ADMIN"],
  },
  {
    path: "/dashboard/report",
    element: <ReportView />,
    role: ["ADMIN", "KARYAWAN"],
  },
  {
    path: "/dashboard/report/create",
    element: <ReportAddView />,
    role: ["KARYAWAN"],
  },
  {
    path: "/dashboard/attendance",
    element: <AttendanceView />,
    role: ["KARYAWAN", "ADMIN"],
  },
  {
    path: "/dashboard/attendance/:id",
    element: <AttendanceDetailView />,
    role: ["KARYAWAN", "ADMIN"],
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
    path: "/attendance",
    element: <AttendancePage />,
  },
  {
    path: "/",
    element: <AdminView />,
    children: allRoutes,
  },
]);
