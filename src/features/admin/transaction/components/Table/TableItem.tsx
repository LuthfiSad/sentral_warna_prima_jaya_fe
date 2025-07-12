// @features/transaction/components/Table/TableItem.tsx
import { TransactionModel } from "@core/model/transaction";
import { UserModel } from "@core/model/user";
import React from "react";
import { Link } from "react-router-dom";

interface ITransactionItemProps extends TransactionModel {
  show?: boolean;
  linkUpdate: string;
  linkDetail: string;
  handleDelete: (id: string) => void;
  handleStartWork: (id: string) => void;
  handleFinalize: (id: string) => void;
  handleMarkPaid: (id: string) => void;
  dataUser: UserModel;
}

export const TableItem: React.FC<ITransactionItemProps> = ({
  id,
  customer,
  complaint,
  status,
  total_cost,
  created_at,
  show,
  linkUpdate,
  linkDetail,
  handleDelete,
  handleStartWork,
  handleFinalize,
  handleMarkPaid,
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DIBAYAR":
        return "bg-success";
      case "SELESAI":
        return "bg-info";
      case "PROSES":
        return "bg-warning";
      case "PENDING":
        return "bg-secondary";
      case "PENDING":
        return "bg-primary";
      default:
        return "bg-secondary";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "DIBAYAR":
        return "Dibayar";
      case "SELESAI":
        return "Selesai";
      case "PROSES":
        return "Dalam Proses";
      case "PENDING":
        return "Menunggu";
      case "PENDING":
        return "Pending";
      default:
        return status;
    }
  };

  const truncateText = (text: string, maxLength: number = 40) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const getAvailableActions = () => {
    const actions = [];

    // Detail button - always available
    actions.push(
      <Link key="detail" to={linkDetail}>
        <button className="btn btn-link p-0 text-info text-xs font-semibold">
          Detail
        </button>
      </Link>
    );

    // Employee actions
    if (!dataUser?.is_admin) {
      if (status === "PENDING") {
        actions.push(
          <button
            key="start"
            className="btn btn-link p-0 text-success text-xs font-semibold"
            onClick={() => {
              const confirm = window.confirm("Mulai pengerjaan transaksi ini?");
              if (!confirm) return;
              handleStartWork(id.toString());
            }}
          >
            Mulai Kerja
          </button>
        );
      }
    }

    // Admin actions
    if (dataUser?.is_admin) {
      if (status === "PENDING") {
        actions.push(
          <button
            key="finalize"
            className="btn btn-link p-0 text-primary text-xs font-semibold"
            onClick={() => {
              const confirm = window.confirm("Selesaikan transaksi ini?");
              if (!confirm) return;
              handleFinalize(id.toString());
            }}
          >
            Selesaikan
          </button>
        );
      }

      if (status === "SELESAI") {
        actions.push(
          <button
            key="paid"
            className="btn btn-link p-0 text-success text-xs font-semibold"
            onClick={() => {
              const confirm = window.confirm("Tandai sebagai DIBAYAR?");
              if (!confirm) return;
              handleMarkPaid(id.toString());
            }}
          >
            Tandai Dibayar
          </button>
        );
      }

      // Edit and Delete for admin
      if (status === "PENDING" || status === "PROSES") {
        actions.push(
          <Link key="edit" to={linkUpdate}>
            <button className="btn btn-link p-0 text-warning text-xs font-semibold">
              Ubah
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
                "Apakah Anda yakin ingin menghapus transaksi ini?"
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
      {/* Transaction ID */}
      <td className="py-3 px-3">
        <span className="text-sm font-semibold text-primary">#{id}</span>
      </td>

      {/* Customer Info */}
      <td className="py-3 px-3">
        <div className="d-flex flex-column">
          <span className="text-sm font-semibold text-dark">
            {customer.name}
          </span>
          <span className="text-xs text-muted">{customer.plate_number}</span>
        </div>
      </td>

      {/* Vehicle Info */}
      <td className="py-3 px-3">
        <span className="text-xs font-semibold text-secondary">
          {customer.vehicle_type} - {customer.vehicle_model}
        </span>
      </td>

      {/* Complaint */}
      <td className="py-3 px-3" style={{ maxWidth: "200px" }}>
        <span 
          className="text-xs font-semibold text-secondary" 
          title={complaint}
        >
          {truncateText(complaint)}
        </span>
      </td>

      {/* Status */}
      <td className="py-3 px-3">
        <span
          className={`py-1 px-2 rounded text-[10px] font-medium text-white ${getStatusColor(
            status
          )}`}
        >
          {getStatusText(status)}
        </span>
      </td>

      {/* Total Cost */}
      <td className="py-3 px-3">
        <span className="text-xs font-semibold text-secondary">
          {total_cost ? formatCurrency(total_cost) : "-"}
        </span>
      </td>

      {/* Date */}
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