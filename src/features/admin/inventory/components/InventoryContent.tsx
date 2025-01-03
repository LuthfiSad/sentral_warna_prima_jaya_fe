import { PageLayout } from "@features/admin/components/PageLayout";
import LoadingData from "@features/_global/components/LoadingData";
import {
  Table,
  TableBody,
  TableHead,
} from "@features/_global/components/Table";
import { convertQueryParamsToObject } from "@features/_global/helper";
import React from "react";
import { useSearchParams } from "react-router-dom";
import { useInventory, useInventoryCreation } from "../hooks/useInventory";
import { TableItem } from "./Table/TableItem";
import EmptyData from "@features/_global/components/EmptyData";

export const InventoryContent: React.FC = () => {
  const { data: inventories, isLoading } = useInventory();

  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = convertQueryParamsToObject(searchParams.toString());
  const onPageChange = (page: number) =>
    setSearchParams({ ...queryParams, page: page.toString() });

  const mutation = useInventoryCreation();

  const handleDelete = async (id: string) => {
    await mutation.mutateAsync({
      type: "delete",
      id,
    });
  };

  const pagination = {
    currentPage: inventories?.meta?.page || 1,
    totalPages: inventories?.meta?.totalPages || 1,
    onPageChange,
  };

  const tableHead = [
    "Nama Barang",
    "Satuan",
    "Jumlah",
    "Status baik",
    "Status rusak",
    "Keterangan",
    "Catatan",
    "Action",
  ];

  return (
    <PageLayout
      title="Inventaris"
      action={{
        show: true,
        buttonTitle: "Tambah Inventaris",
        link: { to: "/inventory/create" },
      }}
      headBackground="black"
      showPagination={
        !!(
          inventories?.data?.length &&
          !isLoading &&
          (inventories.meta?.totalData as number) >
            (inventories?.meta?.perPage as number)
        )
      }
      pagination={pagination}
      searchField
      searchPlaceholder="Search Inventaris"
    >
      <Table>
        <TableHead field={tableHead} />

        <TableBody>
          {isLoading ? (
            <tr>
              <td colSpan={tableHead.length}>
                <LoadingData />
              </td>
            </tr>
          ) : !inventories?.data?.length ? (
            <tr>
              <td colSpan={tableHead.length}>
                <EmptyData title="Inventaris" />
              </td>
            </tr>
          ) : (
            <>
              {inventories?.data?.map((item, key) => (
                <TableItem
                  key={key}
                  {...item}
                  show={key !== (inventories?.data?.length as number) - 1}
                  handleDelete={handleDelete}
                />
              ))}
            </>
          )}
        </TableBody>
      </Table>
    </PageLayout>
  );
};
