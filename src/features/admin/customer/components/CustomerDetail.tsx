// @features/customer/components/CustomerDetail.tsx
import React from "react";
import { PageLayout } from "@features/admin/components/PageLayout";
import { useNavigate } from "react-router-dom";
import { useCustomerById, useCustomerTransactionHistory } from "../hooks/useCustomer";
import LoadingData from "@features/_global/components/LoadingData";
import { dataUserAtom } from "@features/admin/store/dataUser";
import { useAtom } from "jotai";
import { FiEdit3, FiPhone, FiMail, FiMapPin, FiTruck } from "react-icons/fi";
import { TransactionModel } from "@core/model/transaction";

export const CustomerDetail: React.FC = () => {
  const { data: customer, isLoading } = useCustomerById();
  const { data: transactions, isLoading: transactionsLoading } = useCustomerTransactionHistory();
  const [dataUser] = useAtom(dataUserAtom);
  const navigate = useNavigate();

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

  if (isLoading) {
    return (
      <PageLayout
        title="Detail Customer"
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

  if (!customer?.data) {
    return (
      <PageLayout
        title="Detail Customer"
        headBackground="blue"
        action={{
          show: true,
          buttonTitle: "Kembali",
          buttonProps: { onClick: () => navigate(-1) },
          colorButton: "secondary",
        }}
      >
        <div className="alert alert-danger">Customer tidak ditemukan</div>
      </PageLayout>
    );
  }

  const customerData = customer.data;

  return (
    <PageLayout
      title="Detail Customer"
      headBackground="blue"
      action={{
        show: true,
        buttonTitle: "Kembali",
        buttonProps: { onClick: () => navigate(-1) },
        colorButton: "secondary",
      }}
    >
      <div className="row">
        {/* Customer Information */}
        <div className="col-md-8">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Informasi Customer</h5>
              {dataUser?.is_admin && (
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => navigate(`/dashboard/customer/edit/${customerData.id}`)}
                >
                  <FiEdit3 className="me-1" />
                  Edit
                </button>
              )}
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label text-muted">Nama Lengkap</label>
                    <p className="h6">{customerData.name}</p>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label text-muted">
                      <FiMail className="me-1" />
                      Email
                    </label>
                    <p>{customerData.email}</p>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label text-muted">
                      <FiPhone className="me-1" />
                      Nomor HP
                    </label>
                    <p>{customerData.phone}</p>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label text-muted">
                      <FiMapPin className="me-1" />
                      Alamat
                    </label>
                    <p>{customerData.address}</p>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label text-muted">Tanggal Daftar</label>
                    <p>{formatDate(customerData.created_at)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Information */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <FiTruck className="me-2" />
                Informasi Kendaraan
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label text-muted">Plat Nomor</label>
                <p className="h6 text-primary">{customerData.plate_number}</p>
              </div>
              
              <div className="mb-3">
                <label className="form-label text-muted">Jenis Kendaraan</label>
                <p>{customerData.vehicle_type}</p>
              </div>
              
              <div className="mb-3">
                <label className="form-label text-muted">Model</label>
                <p>{customerData.vehicle_model}</p>
              </div>
              
              <div className="mb-3">
                <label className="form-label text-muted">Tahun</label>
                <p>{customerData.vehicle_year}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Riwayat Transaksi</h5>
              {dataUser?.is_admin && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => navigate(`/dashboard/transaction/create?customer_id=${customerData.id}`)}
                >
                  Buat Transaksi Baru
                </button>
              )}
            </div>
            <div className="card-body">
              {transactionsLoading ? (
                <LoadingData />
              ) : !transactions?.data?.length ? (
                <div className="text-center py-4">
                  <p className="text-muted">Belum ada riwayat transaksi</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Tanggal</th>
                        <th>Keluhan</th>
                        <th>Status</th>
                        <th>Total Biaya</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.data.map((transaction: TransactionModel) => (
                        <tr key={transaction.id}>
                          <td>{formatDate(transaction.created_at)}</td>
                          <td>{transaction.complaint}</td>
                          <td>
                            <span className={`badge bg-${getStatusColor(transaction.status)}`}>
                              {getStatusText(transaction.status)}
                            </span>
                          </td>
                          <td>
                            {transaction.total_cost ? 
                              new Intl.NumberFormat('id-ID', {
                                style: 'currency',
                                currency: 'IDR',
                                minimumFractionDigits: 0,
                              }).format(transaction.total_cost) : 
                              '-'
                            }
                          </td>
                          <td>
                            <button
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => navigate(`/dashboard/transaction/detail/${transaction.id}`)}
                            >
                              Detail
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};