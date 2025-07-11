// @features/transaction/components/TransactionContent.tsx
import { PageLayout } from "@features/admin/components/PageLayout";
import LoadingData from "@features/_global/components/LoadingData";
import {
  Table,
  TableBody,
  TableHead,
} from "@features/_global/components/Table";
import { convertQueryParamsToObject } from "@features/_global/helper";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTransaction, useTransactionCreation } from "../hooks/useTransaction";
import { TableItem } from "./Table/TableItem";
import EmptyData from "@features/_global/components/EmptyData";
import { dataUserAtom } from "@features/admin/store/dataUser";
import { useAtom } from "jotai";

export const TransactionContent: React.FC = () => {
  const { data: transactions, isLoading } = useTransaction();
  const [dataUser] = useAtom(dataUserAtom);
  const [statusFilter, setStatusFilter] = useState<string>("");

  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = convertQueryParamsToObject(searchParams.toString());
  const onPageChange = (page: number) =>
    setSearchParams({ ...queryParams, page: page.toString() });

  const mutation = useTransactionCreation();

  const handleDelete = async (id: string) => {
    await mutation.mutateAsync({
      type: "delete",
      id,
    });
  };

  const handleStartWork = async (id: string) => {
    await mutation.mutateAsync({
      type: "startWork",
      id,
    });
  };

  const handleFinalize = async (id: string) => {
    await mutation.mutateAsync({
      type: "finalize",
      id,
    });
  };

  const handleMarkPaid = async (id: string) => {
    await mutation.mutateAsync({
      type: "markPaid",
      id,
    });
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    const params = new URLSearchParams(queryParams);
    params.set('status', status);
    params.set('page', '1');
    setSearchParams(params);
  };

  const pagination = {
    currentPage: transactions?.meta?.page || 1,
    totalPages: transactions?.meta?.totalPages || 1,
    onPageChange,
  };

  const tableHead = [
    "ID",
    "Customer",
    "Kendaraan",
    "Keluhan",
    "Status",
    "Total Biaya",
    "Tanggal",
    "Aksi",
  ];

  const statusOptions = [
    { value: "", label: "Semua Status" },
    { value: "PENDING", label: "Menunggu" },
    { value: "PROSES", label: "Dalam Proses" },
    { value: "MENUNGGU_APPROVAL", label: "Menunggu Approval" },
    { value: "SELESAI", label: "Selesai" },
    { value: "DIBAYAR", label: "Dibayar" },
  ];

  return (
    <>
      <PageLayout
        title="Manajemen Transaksi"
        action={
          dataUser?.is_admin
            ? {
                show: true,
                buttonTitle: "Tambah Transaksi",
                link: { to: "/dashboard/transaction/create" },
              }
            : undefined
        }
        headBackground="black"
        showPagination={
          !!(
            transactions?.data?.length &&
            !isLoading &&
            (transactions.meta?.totalData as number) >
              (transactions?.meta?.perPage as number)
          )
        }
        pagination={pagination}
        searchField
        searchPlaceholder="Cari Customer / Plat Nomor / Keluhan"
      >
        {/* Status Filter */}
        <div className="row mb-3">
          <div className="col-md-4">
            <select
              className="form-control"
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Table>
          <TableHead field={tableHead} />

          <TableBody>
            {isLoading ? (
              <tr>
                <td colSpan={tableHead.length}>
                  <LoadingData />
                </td>
              </tr>
            ) : !transactions?.data?.length ? (
              <tr>
                <td colSpan={tableHead.length}>
                  <EmptyData title="Transaksi" />
                </td>
              </tr>
            ) : (
              <>
                {transactions?.data?.map((item, key) => (
                  <TableItem
                    key={key}
                    {...item}
                    show={key !== (transactions?.data?.length as number) - 1}
                    dataUser={dataUser}
                    linkUpdate={`/dashboard/transaction/edit/${item.id}`}
                    linkDetail={`/dashboard/transaction/${item.id}`}
                    handleDelete={handleDelete}
                    handleStartWork={handleStartWork}
                    handleFinalize={handleFinalize}
                    handleMarkPaid={handleMarkPaid}
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