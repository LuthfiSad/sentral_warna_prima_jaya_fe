// @features/history/components/HistoryContent.tsx
import { PageLayout } from "@features/admin/components/PageLayout";
import LoadingData from "@features/_global/components/LoadingData";
import {
  Table,
  TableBody,
  TableHead,
} from "@features/_global/components/Table";
import { convertQueryParamsToObject } from "@features/_global/helper";
import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useHistory } from "../hooks/useHistory";
import EmptyData from "@features/_global/components/EmptyData";
import { FiEye, FiClock, FiUser, FiTruck } from "react-icons/fi";
import { HistoryModel } from "@core/model/history";

export const HistoryContent: React.FC = () => {
  const { data: histories, isLoading } = useHistory();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = convertQueryParamsToObject(searchParams.toString());
  const onPageChange = (page: number) =>
    setSearchParams({ ...queryParams, page: page.toString() });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DIBAYAR":
        return "success";
      case "SELESAI":
        return "info";
      case "PROSES":
        return "warning";
      case "PENDING":
        return "secondary";
      case "MENUNGGU_APPROVAL":
        return "primary";
      default:
        return "secondary";
    }
  };

  const pagination = {
    currentPage: histories?.meta?.page || 1,
    totalPages: histories?.meta?.totalPages || 1,
    onPageChange,
  };

  const tableHead = [
    "Transaksi",
    "Customer",
    "Status",
    "Catatan",
    "Waktu",
    "Aksi",
  ];

  return (
    <>
      <PageLayout
        title="Riwayat Aktivitas"
        headBackground="black"
        showPagination={
          !!(
            histories?.data?.length &&
            !isLoading &&
            (histories.meta?.totalData as number) >
              (histories?.meta?.perPage as number)
          )
        }
        pagination={pagination}
        searchField
        searchPlaceholder="Cari berdasarkan customer atau plat nomor"
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
            ) : !histories?.data?.length ? (
              <tr>
                <td colSpan={tableHead.length}>
                  <EmptyData title="Riwayat" />
                </td>
              </tr>
            ) : (
              <>
                {histories?.data?.map((item: HistoryModel, key: number) => (
                  <tr key={key} className={`${key !== (histories?.data?.length as number) - 1 ? "border-b border-secondary" : ""}`}>
                    {/* Transaction Info */}
                    <td className="py-3 px-3">
                      <div className="d-flex flex-column">
                        <span className="text-sm font-semibold text-primary">
                          #{item.transaction_id}
                        </span>
                        {item.transaction && (
                          <span className="text-xs text-muted" title={item.transaction.complaint}>
                            {item.transaction.complaint.length > 30 
                              ? item.transaction.complaint.substring(0, 30) + "..."
                              : item.transaction.complaint
                            }
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Customer Info */}
                    <td className="py-3 px-3">
                      {item.transaction ? (
                        <div className="d-flex flex-column">
                          <span className="text-sm font-semibold text-dark">
                            <FiUser className="me-1" />
                            {item.transaction.customer.name}
                          </span>
                          <span className="text-xs text-muted">
                            <FiTruck className="me-1" />
                            {item.transaction.customer.plate_number} - {item.transaction.customer.vehicle_type}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3">
                      <span
                        className={`py-1 px-2 rounded text-[10px] font-medium text-white bg-${getStatusColor(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>

                    {/* Note */}
                    <td className="py-3 px-3">
                      <span className="text-xs text-secondary">
                        {item.note || "-"}
                      </span>
                    </td>

                    {/* Time */}
                    <td className="py-3 px-3">
                      <span className="text-xs font-semibold text-secondary">
                        <FiClock className="me-1" />
                        {formatDate(item.created_at)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-5">
                      <div className="d-flex align-items-center gap-2">
                        <button
                          className="btn btn-link p-0 text-info text-xs font-semibold"
                          onClick={() => navigate(`/dashboard/transaction/detail/${item.transaction_id}`)}
                        >
                          <FiEye className="me-1" />
                          Lihat Transaksi
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </PageLayout>
    </>
  );
};