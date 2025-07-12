// @features/report/components/Table/TableItem.tsx - Updated for new flow
import { ReportModel } from "@core/model/report";
import { UserModel } from "@core/model/user";
import React from "react";
import { Link } from "react-router-dom";

interface IReportItemProps extends ReportModel {
  show?: boolean;
  linkUpdate: string;
  // linkDetail: string;
  handleDelete: (id: string) => void;
  handleApprove: (id: string) => void;
  handleReject: (id: string) => void;
  dataUser: UserModel;
}

export const TableItem: React.FC<IReportItemProps> = ({
  id,
  transaction,
  description,
  start_time,
  end_time,
  status,
  rejection_reason,
  image_url,
  employee,
  created_at,
  show,
  linkUpdate,
  // linkDetail,
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-success";
      case "REJECTED":
        return "bg-danger";
      case "PENDING":
        return "bg-primary";
      default:
        return "bg-secondary";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "Disetujui";
      case "REJECTED":
        return "Ditolak";
      case "PENDING":
        return "Pending";
      default:
        return status;
    }
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const calculateDuration = () => {
    const start = new Date(start_time);
    const end = new Date(end_time);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours > 0) {
      return `${diffHours}j ${diffMinutes}m`;
    } else {
      return `${diffMinutes}m`;
    }
  };

  const getAvailableActions = () => {
    const actions = [];

    // Detail button - always available
    // actions.push(
    //   <Link key="detail" to={linkDetail}>
    //     <button className="btn btn-link p-0 text-info text-xs font-semibold">
    //       Detail
    //     </button>
    //   </Link>
    // );

    // Employee actions
    if (!dataUser?.is_admin && String(employee?.id) == dataUser?.employee?.id) {
      if (status === "PENDING" || status === "REJECTED") {
        actions.push(
          <Link key="edit" to={linkUpdate}>
            <button className="btn btn-link p-0 text-warning text-xs font-semibold">
              Edit
            </button>
          </Link>
        );
      }

      if (status === "PENDING") {
        actions.push(
          <button
            key="delete"
            className="btn btn-link p-0 text-danger text-xs font-semibold"
            onClick={() => {
              const confirm = window.confirm(
                "Apakah Anda yakin ingin menghapus PENDING laporan ini?"
              );
              if (!confirm) return;
              handleDelete(id.toString());
            }}
          >
            Hapus
          </button>
        );
      }
    }

    // Admin actions
    if (dataUser?.is_admin) {
      if (status === "PENDING") {
        actions.push(
          <button
            key="approve"
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
        );

        actions.push(
          <button
            key="reject"
            className="btn btn-link p-0 text-danger text-xs font-semibold"
            onClick={() => {
              const reason = prompt("Masukkan alasan penolakan:");
              if (!reason) return;
              handleReject(id.toString());
            }}
          >
            Tolak
          </button>
        );
      }

      // Admin can always edit (for correction purposes)
      if (status !== "APPROVED") {
        actions.push(
          <Link key="admin-edit" to={linkUpdate}>
            <button className="btn btn-link p-0 text-warning text-xs font-semibold">
              Edit
            </button>
          </Link>
        );
      }

      // Admin can delete any non-APPROVED report
      if (status !== "APPROVED") {
        actions.push(
          <button
            key="admin-delete"
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
        );
      }
    }

    return actions;
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
              style={{ width: "60px", height: "60px", objectFit: "cover" }}
            />
          ) : (
            <div
              className="rounded-lg bg-light d-flex align-items-center justify-content-center text-muted"
              style={{ width: "60px", height: "60px" }}
            >
              <span className="text-xs">No Image</span>
            </div>
          )}
        </div>
      </td>

      {/* Transaction Info */}
      <td className="py-3 px-3">
        <div className="d-flex flex-column">
          <span className="text-sm font-semibold text-primary">
            #{transaction.id}
          </span>
          <span
            className="text-xs text-muted"
            title={transaction.customer.name}
          >
            {truncateText(transaction.customer.name, 20)}
          </span>
          <span className="text-xs text-muted">
            {transaction.customer.plate_number}
          </span>
        </div>
      </td>

      {/* Employee Name */}
      <td className="py-3 px-3">
        <span className="text-xs font-semibold text-secondary">
          {employee?.name || "-"}
        </span>
      </td>

      {/* Description */}
      <td className="py-3 px-3" style={{ maxWidth: "200px" }}>
        <span
          className="text-xs font-semibold text-secondary"
          title={description}
        >
          {truncateText(description, 60)}
        </span>
      </td>

      {/* Time & Duration */}
      <td className="py-3 px-3">
        <div className="d-flex flex-column">
          <span className="text-xs font-semibold text-secondary">
            {formatDate(start_time)}
          </span>
          <span className="text-xs text-muted">
            Durasi: {calculateDuration()}
          </span>
        </div>
      </td>

      {/* Status */}
      <td className="py-3 px-3">
        <div className="d-flex flex-column">
          <span
            className={`py-1 px-2 rounded text-[10px] font-medium text-white ${getStatusColor(
              status
            )}`}
          >
            {getStatusText(status)}
          </span>
          {status === "REJECTED" && rejection_reason && (
            <small className="text-danger mt-1" title={rejection_reason}>
              {truncateText(rejection_reason, 30)}
            </small>
          )}
        </div>
      </td>

      {/* Created Date */}
      <td className="py-3 px-3">
        <span className="text-xs font-semibold text-secondary">
          {formatDate(created_at)}
        </span>
      </td>

      {/* Actions */}
      <td className="py-3 px-5">
        <div className="d-flex align-items-center gap-2 flex-wrap">
          {getAvailableActions()}
        </div>
      </td>
    </tr>
  );
};
