import React from "react";
import { StatsCard } from "./StatsCard";
import {
    FaUser,
    FaUserTie,
    FaFileAlt,
    FaCalendarCheck,
  } from "react-icons/fa";
import { useUser } from "@features/admin/user/hooks/useUser";
import { useEmployee } from "@features/admin/employee/hooks/useEmployee";
import { useReport } from "@features/admin/report/hooks/useReport";
import { useAttendance } from "@features/admin/attendance/hooks/useAttendance";
import { useAtom } from "jotai";
import { dataUserAtom } from "@features/admin/store/dataUser";

export const DashboardContent: React.FC = () => {
  const [dataUser] = useAtom(dataUserAtom);
  const { data: users, isLoading: isLoadingUser } = useUser({
    page: 1,
    perPage: 1,
    search: "",
  });
  const { data: employees, isLoading: isLoadingEmployee } = useEmployee({
    page: 1,
    perPage: 1,
    search: "",
  });
  const { data: reports, isLoading: isLoadingReport } = useReport({
    page: 1,
    perPage: 1,
    search: "",
  });
  const { data: attendances, isLoading: isLoadingAttendance } = useAttendance({
    page: 1,
    perPage: 1,
    search: "",
  });

  const statsData = [
    {
      icon: <FaUser />,
      colorClass: "text-white bg-blue-500",
      title: "Total Data User",
      isLoading: isLoadingUser,
      value: users?.meta?.totalData || 0,
      to: dataUser?.is_admin ? "/dashboard/user" : "/",
    },
    {
      icon: <FaUserTie />,
      colorClass: "text-white bg-green-500",
      title: "Total Data Karyawan",
      isLoading: isLoadingEmployee,
      value: employees?.meta?.totalData || 0,
      to: dataUser?.is_admin ? "/dashboard/employee" : "/",
    },
    {
      icon: <FaFileAlt />,
      colorClass: "text-white bg-yellow-500",
      title: "Total Data Laporan",
      isLoading: isLoadingReport,
      value: reports?.meta?.totalData || 0,
      to: "/dashboard/report",
    },
    {
      icon: <FaCalendarCheck />,
      colorClass: "text-white bg-purple-500",
      title: "Total Data Absensi",
      isLoading: isLoadingAttendance,
      value: attendances?.meta?.totalData || 0,
      to: "/dashboard/attendance",
    },
  ];

  return (
    <>
      <div className="row">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>
    </>
  );
};
