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
import { useEmployee, useEmployeeCreation } from "../hooks/useEmployee";
import { TableItem } from "./Table/TableItem";
import EmptyData from "@features/_global/components/EmptyData";

export const EmployeeContent: React.FC = () => {
  const { data: employees, isLoading } = useEmployee();

  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = convertQueryParamsToObject(searchParams.toString());
  const onPageChange = (page: number) =>
    setSearchParams({ ...queryParams, page: page.toString() });

  const mutation = useEmployeeCreation();

  const handleDelete = async (id: string) => {
    await mutation.mutateAsync({
      type: "delete",
      id,
    });
  };

  const pagination = {
    currentPage: employees?.meta?.page || 1,
    totalPages: employees?.meta?.totalPages || 1,
    onPageChange,
  };

  const tableHead = [
    "Foto",
    "Nama",
    "Email",
    "Tanggal Lahir",
    "Alamat",
    "Divisi",
    "Aksi",
  ];

  return (
    <>
      <PageLayout
        title="Karyawan"
        action={{
          show: true,
          buttonTitle: "Tambah Karyawan",
          link: { to: "/dashboard/employee/create" },
        }}
        headBackground="black"
        showPagination={
          !!(
            employees?.data?.length &&
            !isLoading &&
            (employees.meta?.totalData as number) >
              (employees?.meta?.perPage as number)
          )
        }
        pagination={pagination}
        searchField
        searchPlaceholder="Cari Karyawan"
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
            ) : !employees?.data?.length ? (
              <tr>
                <td colSpan={tableHead.length}>
                  <EmptyData title="Karyawan" />
                </td>
              </tr>
            ) : (
              <>
                {employees?.data?.map((item, key) => (
                  <TableItem
                    key={key}
                    {...item}
                    show={key !== (employees?.data?.length as number) - 1}
                    handleDelete={handleDelete}
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
