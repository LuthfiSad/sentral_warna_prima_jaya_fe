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
import { useLocation, useLocationCreation } from "../hooks/useLocation";
import { TableItem } from "./Table/TableItem";
import EmptyData from "@features/_global/components/EmptyData";

export const LocationContent: React.FC = () => {
  const { data: locations, isLoading } = useLocation();

  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = convertQueryParamsToObject(searchParams.toString());
  const onPageChange = (page: number) =>
    setSearchParams({ ...queryParams, page: page.toString() });

  const mutation = useLocationCreation();

  const handleDelete = async (id: string) => {
    await mutation.mutateAsync({
      type: "delete",
      id,
    });
  };

  const pagination = {
    currentPage: locations?.meta?.page || 1,
    totalPages: locations?.meta?.totalPages || 1,
    onPageChange,
  };

  const tableHead = ["Location", "Action"];

  return (
    <PageLayout
      title="Location"
      action={{
        show: true,
        buttonTitle: "Create Location",
        link: { to: "/admin/location/create" },
      }}
      headBackground="black"
      showPagination={
        !!(
          locations?.data?.length &&
          !isLoading &&
          (locations.meta?.totalData as number) >
            (locations?.meta?.perPage as number)
        )
      }
      pagination={pagination}
      searchField
      searchPlaceholder="Search Location"
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
          ) : !locations?.data?.length ? (
            <tr>
              <td colSpan={tableHead.length}>
                <EmptyData title="Location" />
              </td>
            </tr>
          ) : (
            <>
              {locations?.data?.map((item, key) => (
                <TableItem
                  key={key}
                  {...item}
                  show={key !== (locations?.data?.length as number) - 1}
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
