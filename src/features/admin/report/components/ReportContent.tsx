// @features/report/components/ReportContent.tsx - Updated for new flow
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
import {
  useReport,
  useReportCreation,
  useReportExport,
} from "../hooks/useReport";
import { TableItem } from "./Table/TableItem";
import EmptyData from "@features/_global/components/EmptyData";
import { dataUserAtom } from "@features/admin/store/dataUser";
import { useAtom } from "jotai";
import { ReportModel } from "@core/model/report";

export const ReportContent: React.FC = () => {
  const { data: reports, isLoading } = useReport();
  const [dataUser] = useAtom(dataUserAtom);
  const [statusFilter, setStatusFilter] = useState<string>("");

  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = convertQueryParamsToObject(searchParams.toString());
  const onPageChange = (page: number) =>
    setSearchParams({ ...queryParams, page: page.toString() });

  const mutation = useReportCreation();
  const exportMutation = useReportExport();

  const handleDelete = async (id: string) => {
    await mutation.mutateAsync({
      type: "delete",
      id,
    });
  };

  const handleSubmit = async (id: string) => {
    await mutation.mutateAsync({
      type: "submit",
      id,
    });
  };

  const handleApprove = async (id: string) => {
    await mutation.mutateAsync({
      type: "approve",
      id,
    });
  };

  const handleReject = async (id: string) => {
    const reason = prompt("Masukkan alasan penolakan:");
    if (!reason) return;
    
    await mutation.mutateAsync({
      type: "reject",
      id,
      data: { reason },
    });
  };

  const handleExport = async () => {
    await exportMutation.mutateAsync();
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setSearchParams({ 
      ...queryParams, 
      status,
      page: "1" 
    });
  };

  const pagination = {
    currentPage: reports?.meta?.page || 1,
    totalPages: reports?.meta?.totalPages || 1,
    onPageChange,
  };

  const tableHead = [
    "Foto",
    "Transaksi",
    "Karyawan", 
    "Deskripsi",
    "Waktu & Durasi",
    "Status",
    "Dibuat",
    "Aksi",
  ];

  const statusOptions = [
    { value: "", label: "Semua Status" },
    { value: "DRAFT", label: "Draft" },
    { value: "SUBMITTED", label: "Menunggu Approval" },
    { value: "APPROVED", label: "Disetujui" },
    { value: "REJECTED", label: "Ditolak" },
  ];

  const getStatsCards = () => {
    const stats = {
      DRAFT: 0,
      SUBMITTED: 0,
      APPROVED: 0,
      REJECTED: 0,
    };

    reports?.data?.forEach((report: ReportModel) => {
      stats[report.status as keyof typeof stats]++;
    });

    return (
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="text-warning">{stats.DRAFT}</h5>
              <small>Draft</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="text-primary">{stats.SUBMITTED}</h5>
              <small>Menunggu Approval</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="text-success">{stats.APPROVED}</h5>
              <small>Disetujui</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="text-danger">{stats.REJECTED}</h5>
              <small>Ditolak</small>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <PageLayout
        title="Manajemen Laporan"
        action={
          !dataUser?.is_admin
            ? {
                show: true,
                buttonTitle: "Buat Laporan",
                link: { to: "/dashboard/report/create" },
              }
            : undefined
        }
        headBackground="black"
        showPagination={
          !!(
            reports?.data?.length &&
            !isLoading &&
            (reports.meta?.totalData as number) >
              (reports?.meta?.perPage as number)
          )
        }
        pagination={pagination}
        searchField
        searchPlaceholder="Cari berdasarkan transaksi, customer, atau deskripsi"
      >
        {/* Statistics Cards */}
        {!isLoading && reports?.data?.length && getStatsCards()}

        {/* Filters and Export */}
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
          
          {dataUser?.is_admin && (
            <div className="col-md-8 d-flex justify-content-end gap-2">
              <button
                className="btn btn-info btn-sm"
                onClick={() => setSearchParams({ ...queryParams, status: "SUBMITTED", page: "1" })}
              >
                Lihat Pending Approval ({reports?.data?.filter((r: ReportModel) => r.status === "SUBMITTED").length || 0})
              </button>
              
              <button
                className="btn btn-success btn-sm"
                onClick={handleExport}
                disabled={exportMutation.isPending || !reports?.data?.length}
              >
                {exportMutation.isPending ? "Mengekspor..." : "Export Excel"}
              </button>
            </div>
          )}
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
            ) : !reports?.data?.length ? (
              <tr>
                <td colSpan={tableHead.length}>
                  <EmptyData title="Laporan" />
                </td>
              </tr>
            ) : (
              <>
                {reports?.data?.map((item: ReportModel, key: number) => (
                  <TableItem
                    key={key}
                    {...item}
                    show={key !== (reports?.data?.length as number) - 1}
                    dataUser={dataUser}
                    linkUpdate={`/dashboard/report/edit/${item.id}`}
                    // linkDetail={`/dashboard/report/${item.id}`}
                    handleDelete={handleDelete}
                    handleSubmit={handleSubmit}
                    handleApprove={handleApprove}
                    handleReject={handleReject}
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