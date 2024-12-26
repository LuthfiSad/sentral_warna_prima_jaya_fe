import { PageLayout } from "@features/admin/components/PageLayout";
import LoadingData from "@features/_global/components/LoadingData";
import {
  Table,
  TableBody,
  TableHead,
} from "@features/_global/components/Table";
import React, { useState } from "react";
import { useHistory } from "../hooks/useHistory";
import { TableItem } from "./Table/TableItem";
import EmptyData from "@features/_global/components/EmptyData";
import { StatsCard } from "./StatsCard";
import { FaBox, FaCogs, FaNetworkWired, FaPlug, FaTv } from "react-icons/fa";
import { useOnt } from "@features/admin/opticalNetworkTerminal/hooks/useOnt";
import { useStb } from "@features/admin/setTopBox/hooks/useStb";
import { useCable } from "@features/admin/cable/hooks/useCable";
import { useInventory } from "@features/admin/inventory/hooks/useInventory";

export const DashboardContent: React.FC = () => {
  const [pageOnt, setPageOnt] = useState(1);
  const [pageStb, setPageStb] = useState(1);
  const { data: historyOnt, isLoading: isLoadingHistoryOnt } = useHistory({
    page: pageOnt,
    type: "Ont",
  });
  const { data: historyStb, isLoading: isLoadingHistoryStb } = useHistory({
    type: "Stb",
    page: pageStb,
  });

  const onPageChangeOnt = (page: number) => setPageOnt(page);
  const paginationOnt = {
    currentPage: historyOnt?.meta?.page || 1,
    totalPages: historyOnt?.meta?.totalPages || 1,
    onPageChange: onPageChangeOnt,
  };

  const onPageChangeStb = (page: number) => setPageStb(page);
  const paginationStb = {
    currentPage: historyStb?.meta?.page || 1,
    totalPages: historyStb?.meta?.totalPages || 1,
    onPageChange: onPageChangeStb,
  };

  const tableHeadOnt = [
    "Key",
    "Activity",
    "Name",
    "Type",
    "Serial Number",
    "Unit address",
    "Location",
  ];

  const tableHeadStb = [
    "Key",
    "Activity",
    "Package Name",
    "Type",
    "Serial Number",
    "Unit address",
    "Location",
  ];

  const { data: onts, isLoading: isLoadingOnt } = useOnt({ perPage: 999999 });
  const { data: stbs, isLoading: isLoadingStb } = useStb({ perPage: 999999 });
  const { data: patchcord, isLoading: isLoadingPatchcord } = useCable({
    perPage: 999999,
    type: "Patchcord",
  });
  const { data: adaptor, isLoading: isLoadingAdaptor } = useCable({
    perPage: 999999,
    type: "Adaptor",
  });
  const { data: inventory, isLoading: isLoadingInventory } = useInventory({
    perPage: 999999,
  });

  const statsData = [
    {
      icon: <FaNetworkWired />,
      colorClass: "text-white bg-purple-500",
      title: "Total Data Optical Network Terminal",
      isLoading: isLoadingOnt,
      value: onts?.meta?.totalData?.toString() || "0",
    },
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
      title: "Total Data Patch Cord",
      isLoading: isLoadingPatchcord,
      value:
        patchcord?.data
          ?.reduce((acc, item) => acc + item.quantity, 0)
          .toString() || "0",
    },
    {
      icon: <FaCogs />,
      colorClass: "text-white bg-red-500",
      title: "Total Data Cable Adaptor",
      isLoading: isLoadingAdaptor,
      value:
        adaptor?.data
          ?.reduce((acc, item) => acc + item.quantity, 0)
          .toString() || "0",
    },
    {
      icon: <FaBox />,
      colorClass: "text-white bg-yellow-500",
      title: "Total Data Inventory",
      isLoading: isLoadingInventory,
      value:
        inventory?.data
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
      <PageLayout
        title="History Ont"
        headBackground="blue"
        showPagination={
          !!(
            historyOnt?.data?.length &&
            !isLoadingHistoryOnt &&
            (historyOnt.meta?.totalData as number) >
              (historyOnt?.meta?.perPage as number)
          )
        }
        pagination={paginationOnt}
      >
        <Table>
          <TableHead field={tableHeadOnt} />

          <TableBody>
            {isLoadingHistoryOnt ? (
              <tr>
                <td colSpan={tableHeadOnt.length}>
                  <LoadingData />
                </td>
              </tr>
            ) : !historyOnt?.data?.length ? (
              <tr>
                <td colSpan={tableHeadOnt.length}>
                  <EmptyData title="History" />
                </td>
              </tr>
            ) : (
              <>
                {historyOnt?.data?.map((item, key) => (
                  <TableItem
                    key={key}
                    {...item}
                    show={key !== (historyOnt?.data?.length as number) - 1}
                  />
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </PageLayout>
      <PageLayout
        title="History Stb"
        headBackground="green"
        showPagination={
          !!(
            historyStb?.data?.length &&
            !isLoadingHistoryStb &&
            (historyStb.meta?.totalData as number) >
              (historyStb?.meta?.perPage as number)
          )
        }
        pagination={paginationStb}
      >
        <Table>
          <TableHead field={tableHeadStb} />

          <TableBody>
            {isLoadingHistoryStb ? (
              <tr>
                <td colSpan={tableHeadStb.length}>
                  <LoadingData />
                </td>
              </tr>
            ) : !historyStb?.data?.length ? (
              <tr>
                <td colSpan={tableHeadStb.length}>
                  <EmptyData title="History" />
                </td>
              </tr>
            ) : (
              <>
                {historyStb?.data?.map((item, key) => (
                  <TableItem
                    key={key}
                    {...item}
                    show={key !== (historyStb?.data?.length as number) - 1}
                  />
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </PageLayout>
    </>
  );
};
