// @features/customer/components/CustomerContent.tsx
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
import { useCustomer, useCustomerCreation } from "../hooks/useCustomer";
import { TableItem } from "./Table/TableItem";
import EmptyData from "@features/_global/components/EmptyData";
import { dataUserAtom } from "@features/admin/store/dataUser";
import { useAtom } from "jotai";

export const CustomerContent: React.FC = () => {
  const { data: customers, isLoading } = useCustomer();
  const [dataUser] = useAtom(dataUserAtom);

  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = convertQueryParamsToObject(searchParams.toString());
  const onPageChange = (page: number) =>
    setSearchParams({ ...queryParams, page: page.toString() });

  const mutation = useCustomerCreation();

  const handleDelete = async (id: string) => {
    await mutation.mutateAsync({
      type: "delete",
      id,
    });
  };

  const pagination = {
    currentPage: customers?.meta?.page || 1,
    totalPages: customers?.meta?.totalPages || 1,
    onPageChange,
  };

  const tableHead = [
    "Nama Customer",
    "Kontak",
    "Kendaraan",
    "Tanggal Daftar",
    "Aksi",
  ];

  return (
    <>
      <PageLayout
        title="Manajemen Customer"
        action={
          dataUser?.is_admin
            ? {
                show: true,
                buttonTitle: "Tambah Customer",
                link: { to: "/dashboard/customer/create" },
              }
            : undefined
        }
        headBackground="black"
        showPagination={
          !!(
            customers?.data?.length &&
            !isLoading &&
            (customers.meta?.totalData as number) >
              (customers?.meta?.perPage as number)
          )
        }
        pagination={pagination}
        searchField
        searchPlaceholder="Cari Customer / Plat Nomor"
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
            ) : !customers?.data?.length ? (
              <tr>
                <td colSpan={tableHead.length}>
                  <EmptyData title="Customer" />
                </td>
              </tr>
            ) : (
              <>
                {customers?.data?.map((item, key) => (
                  <TableItem
                    key={key}
                    {...item}
                    show={key !== (customers?.data?.length as number) - 1}
                    dataUser={dataUser}
                    linkUpdate={`/dashboard/customer/edit/${item.id}`}
                    linkDetail={`/dashboard/customer/${item.id}`}
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