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
  const { data: inventoryes, isLoading } = useInventory();

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
    currentPage: inventoryes?.meta?.page || 1,
    totalPages: inventoryes?.meta?.totalPages || 1,
    onPageChange,
  };

  const tableHead = [
    "Item Name",
    "Unit",
    "Quantity",
    "Good",
    "Damaged",
    "Information",
    "Notes",
    "Action",
  ];

  return (
    <PageLayout
      title="Inventory"
      action={{
        show: true,
        buttonTitle: "Create Inventory",
        link: { to: "/inventory/create" },
      }}
      headBackground="black"
      showPagination={
        !!(
          inventoryes?.data?.length &&
          !isLoading &&
          (inventoryes.meta?.totalData as number) >
            (inventoryes?.meta?.perPage as number)
        )
      }
      pagination={pagination}
      searchField
      searchPlaceholder="Search Inventory"
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
          ) : !inventoryes?.data?.length ? (
            <tr>
              <td colSpan={tableHead.length}>
                <EmptyData title="Inventory" />
              </td>
            </tr>
          ) : (
            <>
              {inventoryes?.data?.map((item, key) => (
                <TableItem
                  key={key}
                  {...item}
                  show={key !== (inventoryes?.data?.length as number) - 1}
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
