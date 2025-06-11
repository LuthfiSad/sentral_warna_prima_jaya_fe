import React from "react";
import { StatsCard } from "./StatsCard";
import { FaCogs, FaPlug, FaTv } from "react-icons/fa";
import { useStb } from "@features/admin/setTopBox/hooks/useStb";
import { useCable } from "@features/admin/cable/hooks/useCable";

export const DashboardContent: React.FC = () => {
  const { data: stbs, isLoading: isLoadingStb } = useStb({ perPage: 999999 });
  const { data: patchcord, isLoading: isLoadingPatchcord } = useCable({
    perPage: 999999,
    type: "Patchcord",
  });
  const { data: adaptor, isLoading: isLoadingAdaptor } = useCable({
    perPage: 999999,
    type: "Adaptor",
  });

  const statsData = [
    {
      icon: <FaTv />,
      colorClass: "text-white bg-blue-500",
      title: "Total Data Set Top Box",
      isLoading: isLoadingStb,
      value: stbs?.meta?.totalData?.toString() || "0",
    },
    {
      icon: <FaPlug />,
      colorClass: "text-white bg-green-500",
      title: "Total Data Kabel Patch Cord",
      isLoading: isLoadingPatchcord,
      value:
        patchcord?.data
          ?.reduce((acc, item) => acc + item.quantity, 0)
          .toString() || "0",
    },
    {
      icon: <FaCogs />,
      colorClass: "text-white bg-red-500",
      title: "Total Data Kabel Adaptor",
      isLoading: isLoadingAdaptor,
      value:
        adaptor?.data
          ?.reduce((acc, item) => acc + item.quantity, 0)
          .toString() || "0",
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
