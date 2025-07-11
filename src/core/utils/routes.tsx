import AttendanceDetailView from "@features/admin/attendance/view/AttendanceDetailView";
import AttendanceView from "@features/admin/attendance/view/AttendanceView";
import CustomerAddView from "@features/admin/customer/view/CustomerAddView";
import CustomerDetailView from "@features/admin/customer/view/CustomerDetailView";
import CustomerUpdateView from "@features/admin/customer/view/CustomerUpdateView";
import CustomerView from "@features/admin/customer/view/CustomerView";
import DashboardView from "@features/admin/dashboard/view/DashboardView";
import EmployeeAddView from "@features/admin/employee/view/EmployeeAddView";
import EmployeeUpdateView from "@features/admin/employee/view/EmployeeUpdateView";
import EmployeeView from "@features/admin/employee/view/EmployeeView";
import HistoryView from "@features/admin/history/view/HistoryView";
import ReportAddView from "@features/admin/report/view/ReportAddView";
import ReportUpdateView from "@features/admin/report/view/ReportUpdateView";
import ReportView from "@features/admin/report/view/ReportView";
import TransactionAddView from "@features/admin/transaction/view/TransactionAddView";
import TransactionDetailView from "@features/admin/transaction/view/TransactionDetailView";
import TransactionUpdateView from "@features/admin/transaction/view/TransactionUpdateView";
import TransactionView from "@features/admin/transaction/view/TransactionView";
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
    role: ["PERSONALIA", "KARYAWAN"],
  },
  {
    path: "/dashboard/user",
    element: <UserView />,
    role: ["PERSONALIA"],
  },
  {
    path: "/dashboard/user/create",
    element: <UserAddView />,
    role: ["PERSONALIA"],
  },
  {
    path: "/dashboard/user/edit/:id",
    element: <UserUpdateView />,
    role: ["PERSONALIA"],
  },
  {
    path: "/dashboard/employee",
    element: <EmployeeView />,
    role: ["PERSONALIA"],
  },
  {
    path: "/dashboard/employee/create",
    element: <EmployeeAddView />,
    role: ["PERSONALIA"],
  },
  {
    path: "/dashboard/employee/edit/:id",
    element: <EmployeeUpdateView />,
    role: ["PERSONALIA"],
  },

  // Customer Management Routes
  {
    path: "/dashboard/customer",
    element: <CustomerView />,
    role: ["PERSONALIA"],
  },
  {
    path: "/dashboard/customer/create",
    element: <CustomerAddView />,
    role: ["PERSONALIA"],
  },
  {
    path: "/dashboard/customer/edit/:id",
    element: <CustomerUpdateView />,
    role: ["PERSONALIA"],
  },
  {
    path: "/dashboard/customer/:id",
    element: <CustomerDetailView />,
    role: ["PERSONALIA"],
  },

  // Transaction Management Routes
  {
    path: "/dashboard/transaction",
    element: <TransactionView />,
    role: ["PERSONALIA", "KARYAWAN"],
  },
  {
    path: "/dashboard/transaction/create",
    element: <TransactionAddView />,
    role: ["PERSONALIA"],
  },
  {
    path: "/dashboard/transaction/:id/edit",
    element: <TransactionUpdateView />,
    role: ["PERSONALIA"],
  },
  {
    path: "/dashboard/transaction/:id",
    element: <TransactionDetailView />,
    role: ["PERSONALIA", "KARYAWAN"],
  },

  // Report Management Routes
  {
    path: "/dashboard/report",
    element: <ReportView />,
    role: ["PERSONALIA", "KARYAWAN"],
  },
  {
    path: "/dashboard/report/create",
    element: <ReportAddView />,
    role: ["KARYAWAN"],
  },
  {
    path: "/dashboard/report/edit/:id",
    element: <ReportUpdateView />,
    role: ["KARYAWAN", "PERSONALIA"],
  },

  // History Routes
  {
    path: "/dashboard/history",
    element: <HistoryView />,
    role: ["PERSONALIA"],
  },

  {
    path: "/dashboard/attendance",
    element: <AttendanceView />,
    role: ["KARYAWAN", "PERSONALIA"],
  },
  {
    path: "/dashboard/attendance/:id",
    element: <AttendanceDetailView />,
    role: ["KARYAWAN", "PERSONALIA"],
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
