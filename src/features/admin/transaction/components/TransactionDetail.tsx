// @features/transaction/components/TransactionDetail.tsx - Updated with Calculate Cost Modal
import React, { useState } from "react";
import { PageLayout } from "@features/admin/components/PageLayout";
import { useNavigate } from "react-router-dom";
import { useTransactionById, useTransactionHistory, useTransactionCreation } from "../hooks/useTransaction";
import LoadingData from "@features/_global/components/LoadingData";
import { dataUserAtom } from "@features/admin/store/dataUser";
import { useAtom } from "jotai";
import { 
  FiUser, 
  FiTruck, 
  FiFileText, 
  FiClock, 
  FiDollarSign,
  FiEdit3,
  FiPlay,
  FiCheck,
  FiCreditCard
} from "react-icons/fi";
import { HistoryModel } from "@core/model/history";
import { ReportModel } from "@core/model/report";
import { CalculateCostModal } from "./CalculateCostModal";

export const TransactionDetail: React.FC = () => {
  const { data: transaction, isLoading } = useTransactionById();
  const { data: history, isLoading: historyLoading } = useTransactionHistory();
  const [dataUser] = useAtom(dataUserAtom);
  const navigate = useNavigate();
  const mutation = useTransactionCreation();
  
  // Modal state
  const [showCalculateCostModal, setShowCalculateCostModal] = useState(false);

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
      case "MENUNGGU_APPROVAL":
        return "Menunggu Approval";
      default:
        return status;
    }
  };

  const handleStartWork = async () => {
    const confirm = window.confirm("Mulai pengerjaan transaksi ini?");
    if (!confirm) return;
    
    await mutation.mutateAsync({
      type: "startWork",
      id: transaction?.data?.id.toString(),
    });
  };

  const handleFinalize = async () => {
    const confirm = window.confirm("Selesaikan transaksi ini?");
    if (!confirm) return;
    
    await mutation.mutateAsync({
      type: "finalize",
      id: transaction?.data?.id.toString(),
    });
  };

  const handleMarkPaid = async () => {
    const confirm = window.confirm("Tandai sebagai DIBAYAR?");
    if (!confirm) return;
    
    await mutation.mutateAsync({
      type: "markPaid",
      id: transaction?.data?.id.toString(),
    });
  };

  const handleCalculateCost = () => {
    setShowCalculateCostModal(true);
  };

  if (isLoading) {
    return (
      <PageLayout
        title="Detail Transaksi"
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

  if (!transaction?.data) {
    return (
      <PageLayout
        title="Detail Transaksi"
        headBackground="blue"
        action={{
          show: true,
          buttonTitle: "Kembali",
          buttonProps: { onClick: () => navigate(-1) },
          colorButton: "secondary",
        }}
      >
        <div className="alert alert-danger">Transaksi tidak ditemukan</div>
      </PageLayout>
    );
  }

  const transactionData = transaction.data;

  return (
    <PageLayout
      title={`Detail Transaksi #${transactionData.id}`}
      headBackground="blue"
      action={{
        show: true,
        buttonTitle: "Kembali",
        buttonProps: { onClick: () => navigate(-1) },
        colorButton: "secondary",
      }}
    >
      <div className="row">
        {/* Transaction Info */}
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Informasi Transaksi</h5>
              <div className="d-flex gap-2">
                <span className={`badge bg-${getStatusColor(transactionData.status)}`}>
                  {getStatusText(transactionData.status)}
                </span>
                {dataUser?.is_admin && (transactionData.status === "PENDING" || transactionData.status === "PROSES") && (
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => navigate(`/dashboard/transaction/edit/${transactionData.id}`)}
                  >
                    <FiEdit3 className="me-1" />
                    Edit
                  </button>
                )}
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label text-muted">
                      <FiFileText className="me-1" />
                      Keluhan / Masalah
                    </label>
                    <p>{transactionData.complaint}</p>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label text-muted">
                      <FiClock className="me-1" />
                      Tanggal Dibuat
                    </label>
                    <p>{formatDate(transactionData.created_at)}</p>
                  </div>
                  
                  {transactionData.start_time && (
                    <div className="mb-3">
                      <label className="form-label text-muted">Waktu Mulai</label>
                      <p>{formatDate(transactionData.start_time)}</p>
                    </div>
                  )}
                </div>
                
                <div className="col-md-6">
                  {transactionData.total_cost && (
                    <div className="mb-3">
                      <label className="form-label text-muted">
                        <FiDollarSign className="me-1" />
                        Total Biaya
                      </label>
                      <p className="h5 text-success">{formatCurrency(transactionData.total_cost)}</p>
                    </div>
                  )}
                  
                  <div className="mb-3">
                    <label className="form-label text-muted">Terakhir Diperbarui</label>
                    <p>{formatDate(transactionData.updated_at)}</p>
                  </div>
                  
                  {transactionData.end_time && (
                    <div className="mb-3">
                      <label className="form-label text-muted">Waktu Selesai</label>
                      <p>{formatDate(transactionData.end_time)}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">
                <FiUser className="me-2" />
                Informasi Customer
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label text-muted">Nama</label>
                    <p className="h6">{transactionData.customer.name}</p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-muted">Email</label>
                    <p>{transactionData.customer.email}</p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-muted">Nomor HP</label>
                    <p>{transactionData.customer.phone}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label text-muted">
                      <FiTruck className="me-1" />
                      Kendaraan
                    </label>
                    <p className="h6">{transactionData.customer.plate_number}</p>
                    <p className="text-muted">
                      {transactionData.customer.vehicle_type} - {transactionData.customer.vehicle_model} ({transactionData.customer.vehicle_year})
                    </p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-muted">Alamat</label>
                    <p>{transactionData.customer.address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Panel */}
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">Aksi Tersedia</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                {/* Employee Actions */}
                {!dataUser?.is_admin && transactionData.status === "PENDING" && (
                  <button
                    className="btn btn-success"
                    onClick={handleStartWork}
                    disabled={mutation.isPending}
                  >
                    <FiPlay className="me-2" />
                    Mulai Pengerjaan
                  </button>
                )}

                {/* Employee - Create Report */}
                {!dataUser?.is_admin && (transactionData.status === "PROSES" || transactionData.status === "MENUNGGU_APPROVAL") && (
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/dashboard/report/create?transaction_id=${transactionData.id}`)}
                  >
                    <FiFileText className="me-2" />
                    Buat Laporan
                  </button>
                )}

                {/* Admin Actions */}
                {dataUser?.is_admin && transactionData.status === "MENUNGGU_APPROVAL" && (
                  <>
                    <button
                      className="btn btn-warning"
                      onClick={handleCalculateCost}
                      disabled={mutation.isPending}
                    >
                      <FiDollarSign className="me-2" />
                      {transactionData.total_cost ? 'Update Biaya' : 'Hitung Biaya'}
                    </button>
                    {transactionData.total_cost && (
                      <button
                        className="btn btn-info"
                        onClick={handleFinalize}
                        disabled={mutation.isPending}
                      >
                        <FiCheck className="me-2" />
                        Finalisasi
                      </button>
                    )}
                  </>
                )}

                {dataUser?.is_admin && transactionData.status === "SELESAI" && (
                  <button
                    className="btn btn-success"
                    onClick={handleMarkPaid}
                    disabled={mutation.isPending}
                  >
                    <FiCreditCard className="me-2" />
                    Tandai Dibayar
                  </button>
                )}

                {/* View Reports */}
                <button
                  className="btn btn-outline-primary"
                  onClick={() => navigate(`/dashboard/report?transaction_id=${transactionData.id}`)}
                >
                  <FiFileText className="me-2" />
                  Lihat Laporan
                </button>
              </div>
            </div>
          </div>

          {/* Status History */}
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Riwayat Status</h5>
            </div>
            <div className="card-body">
              {historyLoading ? (
                <LoadingData />
              ) : !history?.data?.length ? (
                <p className="text-muted">Belum ada riwayat status</p>
              ) : (
                <div className="timeline">
                  {history.data.map((item: HistoryModel, index: number) => (
                    <div key={item.id} className="timeline-item mb-3">
                      <div className="d-flex">
                        <div className="flex-shrink-0">
                          <div className={`badge bg-${getStatusColor(item.status)} rounded-circle p-2`}>
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <div className="d-flex justify-content-between">
                            <h6 className="mb-1">{getStatusText(item.status)}</h6>
                            <small className="text-muted">{formatDate(item.created_at)}</small>
                          </div>
                          {item.note && (
                            <p className="text-muted mb-0">{item.note}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reports Section */}
      {transactionData.reports && transactionData.reports.length > 0 && (
        <div className="row mt-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Laporan Pekerjaan</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Karyawan</th>
                        <th>Deskripsi</th>
                        <th>Waktu Mulai</th>
                        <th>Waktu Selesai</th>
                        <th>Status</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactionData.reports.map((report: ReportModel) => (
                        <tr key={report.id}>
                          <td>{report.employee?.name || 'N/A'}</td>
                          <td>{report.description}</td>
                          <td>{report.start_time ? formatDate(report.start_time) : 'N/A'}</td>
                          <td>{report.end_time ? formatDate(report.end_time) : 'N/A'}</td>
                          <td>
                            <span className={`badge bg-${getStatusColor(report.status)}`}>
                              {getStatusText(report.status)}
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => navigate(`/dashboard/report/${report.id}`)}
                            >
                              Detail
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Calculate Cost Modal */}
      <CalculateCostModal
        show={showCalculateCostModal}
        onHide={() => setShowCalculateCostModal(false)}
        transactionId={transactionData.id}
        transactionData={{
          id: transactionData.id,
          customer: {
            name: transactionData.customer.name,
            plate_number: transactionData.customer.plate_number,
          },
          reports: transactionData.reports,
          current_total_cost: transactionData.total_cost,
        }}
      />
    </PageLayout>
  );
};