import { PageLayout } from "@features/admin/components/PageLayout";
import LoadingData from "@features/_global/components/LoadingData";
import {
  Table,
  TableBody,
  TableHead,
} from "@features/_global/components/Table";
import { convertQueryParamsToObject } from "@features/_global/helper";
import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useOnt, useOntCreation } from "../hooks/useOnt";
import { TableItem } from "./Table/TableItem";
import EmptyData from "@features/_global/components/EmptyData";

export const OntContent: React.FC = () => {
  const { locationId } = useParams();
  const { data: onts, isLoading } = useOnt({ locationId });

  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = convertQueryParamsToObject(searchParams.toString());
  const onPageChange = (page: number) =>
    setSearchParams({ ...queryParams, page: page.toString() });

  const mutation = useOntCreation();

  const handleDelete = async (id: string) => {
    await mutation.mutateAsync({
      type: "delete",
      id,
    });
  };

  const pagination = {
    currentPage: onts?.meta?.page || 1,
    totalPages: onts?.meta?.totalPages || 1,
    onPageChange,
  };

  const tableHead = [
    "Nomor Seri",
    "Type",
    "Nomor WO",
    "Alamat",
    "Nama",
    "Tanggal Aktivasi",
    "Status",
    "Informasi",
    "Action",
  ];

  return (
    <PageLayout
      title="Optical Network Terminal"
      action={{
        show: true,
        buttonTitle: "Create Optical Network Terminal",
        link: { to: "/admin/ont/create" },
      }}
      headBackground="black"
      showPagination={
        !!(
          onts?.data?.length &&
          !isLoading &&
          (onts.meta?.totalData as number) > (onts?.meta?.perPage as number)
        )
      }
      pagination={pagination}
      searchField
      searchPlaceholder="Search Ont"
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
          ) : !onts?.data?.length ? (
            <tr>
              <td colSpan={tableHead.length}>
                <EmptyData title="optical network terminal" />
              </td>
            </tr>
          ) : (
            <>
              {onts?.data?.map((item, key) => (
                <TableItem
                  key={key}
                  {...item}
                  show={key !== (onts?.data?.length as number) - 1}
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
