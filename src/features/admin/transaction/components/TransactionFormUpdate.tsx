// @features/transaction/components/TransactionFormUpdate.tsx
import React, { useEffect, useState } from "react";
import { PageLayout } from "@features/admin/components/PageLayout";
import { useNavigate } from "react-router-dom";
import { useTransactionById, useTransactionCreation } from "../hooks/useTransaction";
import { CustomApiError } from "@features/_global/types/CustomApiError";
import { TransactionUpdateDTO } from "@core/model/transaction";
import LoadingData from "@features/_global/components/LoadingData";
import { FiUser, FiTruck } from "react-icons/fi";

const InitialValue: TransactionUpdateDTO = {
  complaint: "",
};

export const TransactionFormUpdate: React.FC = () => {
  const mutation = useTransactionCreation();
  const { data: transactionById, isLoading } = useTransactionById();

  const [transactionBody, setTransactionBody] = useState<TransactionUpdateDTO>({
    ...InitialValue,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof TransactionUpdateDTO, string>>
  >({});

  const navigate = useNavigate();

  useEffect(() => {
    if (transactionById && transactionById.data) {
      const { complaint } = transactionById.data;
      setTransactionBody({
        complaint,
      });
    }
  }, [transactionById]);

  const validate = () => {
    const newErrors: Partial<Record<keyof TransactionUpdateDTO, string>> = {};
    let isValid = true;

    if (!transactionBody.complaint?.trim()) {
      newErrors.complaint = "Keluhan wajib diisi";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    
    try {
      await mutation.mutateAsync({
        type: "update",
        data: transactionBody,
        id: transactionById?.data?.id.toString(),
      });
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        (error as CustomApiError).error !== undefined
      ) {
        const customError = error as CustomApiError;
        setErrors({ ...customError.error });
      }
    }
  };

  const handleReset = () => {
    if (transactionById && transactionById.data) {
      const { complaint } = transactionById.data;
      setTransactionBody({
        complaint,
      });
    } else {
      setTransactionBody(InitialValue);
    }
    setErrors({});
  };

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

  if (isLoading) {
    return (
      <PageLayout
        title="Ubah Transaksi"
        headBackground="blue"
        action={{
          show: true,
          buttonTitle: "Cancel",
          buttonProps: { onClick: () => navigate(-1) },
          colorButton: "red",
        }}
      >
        <LoadingData />
      </PageLayout>
    );
  }

  if (!transactionById?.data) {
    return (
      <PageLayout
        title="Ubah Transaksi"
        headBackground="blue"
        action={{
          show: true,
          buttonTitle: "Cancel",
          buttonProps: { onClick: () => navigate(-1) },
          colorButton: "red",
        }}
      >
        <div className="alert alert-danger">Transaksi tidak ditemukan</div>
      </PageLayout>
    );
  }

  const transaction = transactionById.data;

  return (
    <PageLayout
      title={`Ubah Transaksi #${transaction.id}`}
      headBackground="blue"
      action={{
        show: true,
        buttonTitle: "Cancel",
        buttonProps: { onClick: () => navigate(-1) },
        colorButton: "red",
      }}
    >
      {/* Transaction Info (Read Only) */}
      <div className="card mb-4">
        <div className="card-header">
          <h6 className="mb-0">Informasi Transaksi</h6>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label text-muted">
                  <FiUser className="me-1" />
                  Customer
                </label>
                <p className="h6">{transaction.customer.name}</p>
                <p className="text-muted mb-0">{transaction.customer.email}</p>
                <p className="text-muted mb-0">{transaction.customer.phone}</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label text-muted">
                  <FiTruck className="me-1" />
                  Kendaraan
                </label>
                <p className="h6">{transaction.customer.plate_number}</p>
                <p className="text-muted mb-0">
                  {transaction.customer.vehicle_type} - {transaction.customer.vehicle_model} ({transaction.customer.vehicle_year})
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label text-muted">Status Saat Ini</label>
                <p>
                  <span className={`badge bg-${
                    transaction.status === "DIBAYAR" ? "success" :
                    transaction.status === "SELESAI" ? "info" :
                    transaction.status === "PROSES" ? "warning" :
                    transaction.status === "MENUNGGU_APPROVAL" ? "primary" :
                    "secondary"
                  }`}>
                    {transaction.status === "DIBAYAR" ? "Dibayar" :
                     transaction.status === "SELESAI" ? "Selesai" :
                     transaction.status === "PROSES" ? "Dalam Proses" :
                     transaction.status === "MENUNGGU_APPROVAL" ? "Menunggu Approval" :
                     "Menunggu"}
                  </span>
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label text-muted">Tanggal Dibuat</label>
                <p>{formatDate(transaction.created_at)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form className="form form-horizontal mt-4" onSubmit={handleSubmit}>
        <div className="form-body">
          <div className="row">
            {/* Complaint Field */}
            <div className="col-md-4">
              <label htmlFor="complaint">Keluhan / Masalah</label>
            </div>
            <div className="col-md-8 form-group">
              <textarea
                className="form-control"
                placeholder="Deskripsikan masalah atau keluhan customer..."
                id="complaint"
                rows={5}
                value={transactionBody.complaint}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setTransactionBody((prev) => ({
                    ...prev,
                    complaint: e.target.value,
                  }))
                }
                disabled={mutation.isPending}
              />
              {errors.complaint && (
                <small className="text-danger">{errors.complaint}</small>
              )}
              <small className="text-muted">
                Jelaskan secara detail masalah yang dialami customer
              </small>
            </div>

            {/* Submit and Reset Buttons */}
            <div className="col-12 d-flex justify-content-end">
              <button
                type="submit"
                className="btn btn-primary me-1 mb-1"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
              <button
                type="button"
                className="btn btn-light-secondary me-1 mb-1"
                disabled={mutation.isPending}
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Info Card */}
      <div className="card mt-4">
        <div className="card-body">
          <h6 className="card-title">Informasi</h6>
          <ul className="list-unstyled mb-0">
            <li className="mb-1">• Hanya keluhan yang dapat diubah setelah transaksi dibuat</li>
            <li className="mb-1">• Customer dan kendaraan tidak dapat diubah</li>
            <li className="mb-1">• Transaksi hanya dapat diubah jika status masih <strong>PENDING</strong> atau <strong>PROSES</strong></li>
            <li>• Perubahan akan tercatat dalam riwayat transaksi</li>
          </ul>
        </div>
      </div>
    </PageLayout>
  );
};