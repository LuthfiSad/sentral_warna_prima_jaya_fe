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
import {
  useReport,
  useReportCreation,
  useReportExport,
} from "../hooks/useReport";
import { TableItem } from "./Table/TableItem";
import EmptyData from "@features/_global/components/EmptyData";
import { dataUserAtom } from "@features/admin/store/dataUser";
import { useAtom } from "jotai";

export const ReportContent: React.FC = () => {
  const { data: reports, isLoading } = useReport();
  const [dataUser] = useAtom(dataUserAtom);

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

  const handleApprove = async (id: string) => {
    await mutation.mutateAsync({
      type: "changeStatus",
      id,
      data: { status: "approve" },
    });
  };

  const handleReject = async (id: string) => {
    await mutation.mutateAsync({
      type: "changeStatus",
      id,
      data: { status: "reject" },
    });
  };

  const handleExport = async () => {
    await exportMutation.mutateAsync();
  };

  const pagination = {
    currentPage: reports?.meta?.page || 1,
    totalPages: reports?.meta?.totalPages || 1,
    onPageChange,
  };

  const tableHead = [
    "Gambar",
    "Tanggal",
    "Nama Karyawan",
    "Laporan",
    "Status",
    ...(dataUser?.is_admin ? ["Aksi"] : []),
  ];

  return (
    <>
      <PageLayout
        title="Laporan"
        action={
          dataUser?.is_admin
            ? undefined
            : {
                show: true,
                buttonTitle: "Tambah Laporan",
                link: { to: "/report/create" },
              }
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
        searchPlaceholder="Cari Laporan"
      >
        {dataUser?.is_admin && (
          <div className="d-flex justify-content-end mb-3">
            <button
              className="btn btn-success btn-sm"
              onClick={handleExport}
              disabled={exportMutation.isPending || !reports?.data?.length}
            >
              {exportMutation.isPending ? "Mengekspor..." : "Export CSV"}
            </button>
          </div>
        )}

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
                {reports?.data?.map((item, key) => (
                  <TableItem
                    key={key}
                    {...item}
                    show={key !== (reports?.data?.length as number) - 1}
                    dataUser={dataUser}
                    handleDelete={handleDelete}
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
