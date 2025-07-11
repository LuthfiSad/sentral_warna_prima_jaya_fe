// @features/report/components/ReportDetail.tsx
import React from "react";
import { PageLayout } from "@features/admin/components/PageLayout";
import { useNavigate } from "react-router-dom";
import { useReportById, useReportCreation } from "../hooks/useReport";
import LoadingData from "@features/_global/components/LoadingData";
import { dataUserAtom } from "@features/admin/store/dataUser";
import { useAtom } from "jotai";
import {
  FiUser,
  FiTruck,
  FiFileText,
  FiClock,
  FiEdit3,
  FiCheck,
  FiX,
  FiSend,
} from "react-icons/fi";

export const ReportDetail: React.FC = () => {
  const { data: report, isLoading } = useReportById();
  const [dataUser] = useAtom(dataUserAtom);
  const navigate = useNavigate();
  const mutation = useReportCreation();

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
        return "success";
      case "REJECTED":
        return "danger";
      case "SUBMITTED":
        return "primary";
      case "DRAFT":
        return "warning";
      default:
        return "secondary";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "Disetujui";
      case "REJECTED":
        return "Ditolak";
      case "SUBMITTED":
        return "Menunggu Approval";
      case "DRAFT":
        return "Draft";
      default:
        return status;
    }
  };

  const calculateDuration = () => {
    if (!report?.data?.start_time || !report?.data?.end_time) return "-";

    const start = new Date(report.data.start_time);
    const end = new Date(report.data.end_time);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours > 0) {
      return `${diffHours} jam ${diffMinutes} menit`;
    } else {
      return `${diffMinutes} menit`;
    }
  };

  const handleSubmit = async () => {
    const confirm = window.confirm(
      "Submit laporan untuk approval? Setelah disubmit, laporan tidak dapat diedit kecuali ditolak."
    );
    if (!confirm) return;

    await mutation.mutateAsync({
      type: "submit",
      id: report?.data?.id.toString(),
    });
  };

  const handleApprove = async () => {
    const confirm = window.confirm(
      "Apakah Anda yakin ingin menyetujui laporan ini?"
    );
    if (!confirm) return;

    await mutation.mutateAsync({
      type: "approve",
      id: report?.data?.id.toString(),
    });
  };

  const handleReject = async () => {
    const reason = prompt("Masukkan alasan penolakan:");
    if (!reason) return;

    await mutation.mutateAsync({
      type: "reject",
      id: report?.data?.id.toString(),
      data: { reason },
    });
  };

  if (isLoading) {
    return (
      <PageLayout
        title="Detail Laporan"
        headBackground="blue"
        action={{
          show: true,
          buttonTitle: "Kembali",
          buttonProps: { onClick: () => navigate(-1) },
          colorButton: "secondary",
        }}
      >
        <LoadingData />
      </PageLayout>
    );
  }

  if (!report?.data) {
    return (
      <PageLayout
        title="Detail Laporan"
        headBackground="blue"
        action={{
          show: true,
          buttonTitle: "Kembali",
          buttonProps: { onClick: () => navigate(-1) },
          colorButton: "secondary",
        }}
      >
        <div className="alert alert-danger">Laporan tidak ditemukan</div>
      </PageLayout>
    );
  }

  const reportData = report.data;

  return (
    <PageLayout
      title={`Detail Laporan #${reportData.id}`}
      headBackground="blue"
      action={{
        show: true,
        buttonTitle: "Kembali",
        buttonProps: { onClick: () => navigate(-1) },
        colorButton: "secondary",
      }}
    >
      <div className="row">
        {/* Report Details */}
        <div className="col-md-8">
          {/* Report Status & Info */}
          <div className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Informasi Laporan</h5>
              <div className="d-flex gap-2 align-items-center">
                <span
                  className={`badge bg-${getStatusColor(reportData.status)}`}
                >
                  {getStatusText(reportData.status)}
                </span>
                {((reportData.status === "DRAFT" ||
                  reportData.status === "REJECTED") &&
                  String(reportData.employee.id) === dataUser?.id) ||
                dataUser?.is_admin ? (
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() =>
                      navigate(`/dashboard/report/edit/${reportData.id}`)
                    }
                  >
                    <FiEdit3 className="me-1" />
                    Edit
                  </button>
                ) : null}
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label text-muted">
                      <FiFileText className="me-1" />
                      Deskripsi Pekerjaan
                    </label>
                    <p className="text-break">{reportData.description}</p>
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-muted">
                      <FiClock className="me-1" />
                      Waktu Pengerjaan
                    </label>
                    <p>
                      <strong>Mulai:</strong>{" "}
                      {formatDate(reportData.start_time)}
                      <br />
                      <strong>Selesai:</strong>{" "}
                      {formatDate(reportData.end_time)}
                      <br />
                      <strong>Durasi:</strong> {calculateDuration()}
                    </p>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label text-muted">Karyawan</label>
                    <p className="h6">{reportData.employee.name}</p>
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-muted">Dibuat</label>
                    <p>{formatDate(reportData.created_at)}</p>
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-muted">
                      Terakhir Diupdate
                    </label>
                    <p>{formatDate(reportData.updated_at)}</p>
                  </div>
                </div>
              </div>

              {/* Rejection Reason */}
              {reportData.status === "REJECTED" &&
                reportData.rejection_reason && (
                  <div className="alert alert-danger mt-3">
                    <h6 className="alert-heading">Alasan Penolakan</h6>
                    <p className="mb-0">{reportData.rejection_reason}</p>
                  </div>
                )}

              {/* Image */}
              {reportData.image_url && (
                <div className="mt-3">
                  <label className="form-label text-muted">
                    Foto Pekerjaan
                  </label>
                  <div className="mt-2">
                    <img
                      src={reportData.image_url}
                      alt="Report Image"
                      className="img-fluid rounded"
                      style={{ maxHeight: "400px", cursor: "pointer" }}
                      onClick={() =>
                        window.open(reportData.image_url, "_blank")
                      }
                    />
                    <small className="text-muted d-block mt-1">
                      Klik gambar untuk memperbesar
                    </small>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Transaction Info */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">Informasi Transaksi</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label text-muted">
                      <FiUser className="me-1" />
                      Customer
                    </label>
                    <p className="h6">{reportData.transaction.customer.name}</p>
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-muted">
                      <FiTruck className="me-1" />
                      Kendaraan
                    </label>
                    <p className="h6">
                      {reportData.transaction.customer.plate_number}
                    </p>
                    <p className="text-muted mb-0">
                      {reportData.transaction.customer.vehicle_type} -{" "}
                      {reportData.transaction.customer.vehicle_model}
                    </p>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label text-muted">
                      ID Transaksi
                    </label>
                    <p className="h6">
                      <button
                        className="btn btn-link p-0 text-primary"
                        onClick={() =>
                          navigate(
                            `/dashboard/transaction/detail/${reportData.transaction.id}`
                          )
                        }
                      >
                        #{reportData.transaction.id}
                      </button>
                    </p>
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-muted">Keluhan</label>
                    <p>{reportData.transaction.complaint}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Panel */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Aksi Tersedia</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                {/* Employee Actions */}
                {!dataUser?.is_admin &&
                  String(reportData.employee.id) === dataUser?.id && (
                    <>
                      {reportData.status === "DRAFT" && (
                        <button
                          className="btn btn-success"
                          onClick={handleSubmit}
                          disabled={mutation.isPending}
                        >
                          <FiSend className="me-2" />
                          Submit untuk Approval
                        </button>
                      )}
                    </>
                  )}

                {/* Admin Actions */}
                {dataUser?.is_admin && reportData.status === "SUBMITTED" && (
                  <>
                    <button
                      className="btn btn-danger"
                      onClick={handleReject}
                      disabled={mutation.isPending}
                    >
                      <FiX className="me-2" />
                      Tolak Laporan
                    </button>
                    <button
                      className="btn btn-success"
                      onClick={handleApprove}
                      disabled={mutation.isPending}
                    >
                      <FiCheck className="me-2" />
                      Terima Laporan
                    </button>
                  </>
                )}

                {/* View Transaction */}
                <button
                  className="btn btn-outline-primary"
                  onClick={() =>
                    navigate(
                      `/dashboard/transaction/detail/${reportData.transaction.id}`
                    )
                  }
                >
                  <FiFileText className="me-2" />
                  Lihat Transaksi
                </button>

                {/* Print Report */}
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => window.print()}
                >
                  <FiFileText className="me-2" />
                  Print Laporan
                </button>
              </div>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="card mt-4">
            <div className="card-header">
              <h5 className="mb-0">Timeline Status</h5>
            </div>
            <div className="card-body">
              <div className="timeline">
                <div className="timeline-item mb-3">
                  <div className="d-flex">
                    <div className="flex-shrink-0">
                      <div className="badge bg-warning rounded-circle p-2">
                        1
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6 className="mb-1">Draft Dibuat</h6>
                      <small className="text-muted">
                        {formatDate(reportData.created_at)}
                      </small>
                    </div>
                  </div>
                </div>

                {reportData.status !== "DRAFT" && (
                  <div className="timeline-item mb-3">
                    <div className="d-flex">
                      <div className="flex-shrink-0">
                        <div className="badge bg-primary rounded-circle p-2">
                          2
                        </div>
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <h6 className="mb-1">Submitted untuk Approval</h6>
                        <small className="text-muted">
                          {formatDate(reportData.updated_at)}
                        </small>
                      </div>
                    </div>
                  </div>
                )}

                {(reportData.status === "APPROVED" ||
                  reportData.status === "REJECTED") && (
                  <div className="timeline-item mb-3">
                    <div className="d-flex">
                      <div className="flex-shrink-0">
                        <div
                          className={`badge bg-${
                            reportData.status === "APPROVED"
                              ? "success"
                              : "danger"
                          } rounded-circle p-2`}
                        >
                          3
                        </div>
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <h6 className="mb-1">
                          {reportData.status === "APPROVED"
                            ? "Disetujui"
                            : "Ditolak"}
                        </h6>
                        <small className="text-muted">
                          {formatDate(reportData.updated_at)}
                        </small>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Report Stats */}
          <div className="card mt-4">
            <div className="card-header">
              <h5 className="mb-0">Statistik</h5>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-6">
                  <h4 className="text-primary">{calculateDuration()}</h4>
                  <small className="text-muted">Total Waktu</small>
                </div>
                <div className="col-6">
                  <h4 className="text-success">
                    {reportData.status === "APPROVED" ? "✓" : "⏳"}
                  </h4>
                  <small className="text-muted">Status</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          .btn,
          .card-header,
          .timeline {
            display: none !important;
          }
          .card {
            border: none !important;
            box-shadow: none !important;
          }
          .col-md-4 {
            display: none !important;
          }
          .col-md-8 {
            width: 100% !important;
          }
        }
      `}</style>
    </PageLayout>
  );
};
