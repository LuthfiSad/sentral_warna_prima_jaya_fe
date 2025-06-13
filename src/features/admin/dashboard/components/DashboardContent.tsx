import React from "react";
import { StatsCard } from "./StatsCard";
import { FaCogs, FaPlug, FaTv } from "react-icons/fa";

export const DashboardContent: React.FC = () => {

  const statsData = [
    {
      icon: <FaTv />,
      colorClass: "text-white bg-blue-500",
      title: "Total Data Set Top Box",
      isLoading: false,
      value: 10
    },
    {
      icon: <FaPlug />,
      colorClass: "text-white bg-green-500",
      title: "Total Data Kabel Patch Cord",
      isLoading: false,
      value: 10
    },
    {
      icon: <FaCogs />,
      colorClass: "text-white bg-red-500",
      title: "Total Data Kabel Adaptor",
      isLoading: false,
      value: 10
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
