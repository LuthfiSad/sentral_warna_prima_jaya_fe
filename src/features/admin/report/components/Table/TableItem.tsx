import { ReportModel } from "@core/model/report";
import { UserModel } from "@core/model/user";
import React from "react";

interface IReportItemProps extends ReportModel {
  show?: boolean;
  handleDelete: (id: string) => void;
  handleApprove: (id: string) => void;
  handleReject: (id: string) => void;
  dataUser: UserModel;
}

export const TableItem: React.FC<IReportItemProps> = ({
  id,
  date,
  report,
  status,
  image_url,
  employee,
  show,
  handleDelete,
  handleApprove,
  handleReject,
  dataUser,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-success";
      case "rejected":
        return "bg-danger";
      case "pending":
        return "bg-warning";
      default:
        return "bg-secondary";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Disetujui";
      case "rejected":
        return "Ditolak";
      case "pending":
        return "Menunggu";
      default:
        return status;
    }
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <tr key={id} className={`${show ? "border-b border-secondary" : ""}`}>
      {/* Image Column */}
      <td className="py-3">
        <div className="d-flex align-items-center">
          {image_url ? (
            <img
              src={image_url}
              alt="Report"
              className="rounded-lg"
              style={{ width: '100%', height: '100px', objectFit: 'cover' }}
            />
          ) : (
            <div
              className="rounded-lg bg-light d-flex align-items-center justify-content-center text-muted"
              style={{ width: "100%", height: "100px" }}
            >
              <span className="text-xs">No Image</span>
            </div>
          )}
        </div>
      </td>

      {/* Date Column */}
      <td className="py-3 px-5">
        <span className="text-xs font-semibold text-secondary">
          {formatDate(date)}
        </span>
      </td>

      {/* Employee Name Column */}
      <td className="py-3 px-5">
        <span className="text-xs font-semibold text-secondary">
          {employee?.name || "-"}
        </span>
      </td>

      {/* Report Column */}
      <td className="py-3 px-5" style={{ maxWidth: "200px" }}>
        <span className="text-xs font-semibold text-secondary" title={report}>
          {truncateText(report)}
        </span>
      </td>

      {/* Status Column */}
      <td className="py-3 px-5">
        <span
          className={`py-1 px-3 rounded text-[11px] font-medium text-white ${getStatusColor(
            status
          )}`}
        >
          {getStatusText(status)}
        </span>
      </td>

      {/* Actions Column */}
      {dataUser?.is_admin && (
        <td className="py-3 px-5">
          <div className="d-flex align-items-center gap-2">
            {status === "pending" && (
              <>
                <button
                  className="btn btn-link p-0 text-success text-xs font-semibold"
                  onClick={() => {
                    const confirm = window.confirm(
                      "Apakah Anda yakin ingin menyetujui laporan ini?"
                    );
                    if (!confirm) return;
                    handleApprove(id.toString());
                  }}
                >
                  Setuju
                </button>
                <button
                  className="btn btn-link p-0 text-warning text-xs font-semibold"
                  onClick={() => {
                    const confirm = window.confirm(
                      "Apakah Anda yakin ingin menolak laporan ini?"
                    );
                    if (!confirm) return;
                    handleReject(id.toString());
                  }}
                >
                  Tolak
                </button>
              </>
            )}
            <button
              className="btn btn-link p-0 text-danger text-xs font-semibold"
              onClick={() => {
                const confirm = window.confirm(
                  "Apakah Anda yakin ingin menghapus laporan ini?"
                );
                if (!confirm) return;
                handleDelete(id.toString());
              }}
            >
              Hapus
            </button>
          </div>
        </td>
      )}
    </tr>
  );
};
