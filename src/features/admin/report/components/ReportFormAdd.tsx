// @features/report/components/ReportFormAdd.tsx - Updated for new flow
import React, { useState, useEffect } from "react";
import { PageLayout } from "@features/admin/components/PageLayout";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CustomApiError } from "@features/_global/types/CustomApiError";
import { FiX, FiTruck, FiUser } from "react-icons/fi";
import { useReportCreation } from "../hooks/useReport";
import { ReportCreateDTO } from "@core/model/report";
import LoadingData from "@features/_global/components/LoadingData";
import { useTransactionById } from "@features/admin/transaction/hooks/useTransaction";
import { TransactionSelector } from "@features/admin/transaction/components/TransactionSelector";
import { TransactionModel } from "@core/model/transaction";

const InitialValue: ReportCreateDTO = {
  transaction_id: 0,
  description: "",
  start_time: "",
  end_time: "",
};

export const ReportFormAdd: React.FC = () => {
  const mutation = useReportCreation();
  const [searchParams] = useSearchParams();
  const transactionId = searchParams.get("transaction_id");
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionModel | null>(null);

  const { data: transaction, isLoading: transactionLoading } =
    useTransactionById();

  const [reportBody, setReportBody] = useState<ReportCreateDTO>({
    ...InitialValue,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ReportCreateDTO, string>>
  >({});

  const navigate = useNavigate();

  useEffect(() => {
    if (selectedTransaction) {
      setReportBody((prev) => ({
        ...prev,
        transaction_id: selectedTransaction.id,
      }));
    }
  }, [selectedTransaction]);

  useEffect(() => {
    if (transactionId) {
      setReportBody((prev) => ({
        ...prev,
        transaction_id: parseInt(transactionId),
      }));
    }
  }, [transactionId]);

  const validate = () => {
    const newErrors: Partial<Record<keyof ReportCreateDTO, string>> = {};
    let isValid = true;

    if (!reportBody.transaction_id) {
      newErrors.transaction_id = "Transaksi wajib dipilih";
      isValid = false;
    }

    if (!reportBody.description) {
      newErrors.description = "Deskripsi pekerjaan wajib diisi";
      isValid = false;
    }

    if (!reportBody.start_time) {
      newErrors.start_time = "Waktu mulai wajib diisi";
      isValid = false;
    }

    if (!reportBody.end_time) {
      newErrors.end_time = "Waktu SELESAI wajib diisi";
      isValid = false;
    }

    if (reportBody.start_time && reportBody.end_time) {
      const startTime = new Date(reportBody.start_time);
      const endTime = new Date(reportBody.end_time);
      if (endTime <= startTime) {
        newErrors.end_time = "Waktu SELESAI harus setelah waktu mulai";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const formData = new FormData();
      formData.append("transaction_id", reportBody.transaction_id.toString());
      formData.append("description", reportBody.description);
      formData.append("start_time", reportBody.start_time);
      formData.append("end_time", reportBody.end_time);

      if (reportBody.image) {
        formData.append("image", reportBody.image);
      }

      await mutation.mutateAsync({
        type: "create",
        data: formData,
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
    setReportBody({
      ...InitialValue,
      transaction_id: transactionId ? parseInt(transactionId) : 0,
    });
    setSelectedTransaction(null);
    setImagePreview(null);
    setErrors({});
  };

  const handleTransactionSelect = (transaction: TransactionModel) => {
    setSelectedTransaction(transaction);
    // Clear any previous transaction_id error
    setErrors((prev) => ({ ...prev, transaction_id: undefined }));
  };

  const handleClearTransactionSelection = () => {
    setSelectedTransaction(null);
    setReportBody((prev) => ({
      ...prev,
      transaction_id: 0,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReportBody((prev) => ({
        ...prev,
        image: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setReportBody((prev) => ({
      ...prev,
      image: undefined,
    }));
    setImagePreview(null);

    // Reset file input
    const fileInput = document.getElementById("image") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    if (!dateTimeString) return "";
    return dateTimeString.slice(0, 16); // Format for datetime-local input
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    return formatDateTime(now.toISOString());
  };

  if (transactionLoading) {
    return (
      <PageLayout
        title="Buat Laporan Pekerjaan"
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

  if (!transaction?.data && transactionId) {
    return (
      <PageLayout
        title="Buat Laporan Pekerjaan"
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

  return (
    <PageLayout
      title="Buat Laporan Pekerjaan"
      headBackground="blue"
      action={{
        show: true,
        buttonTitle: "Cancel",
        buttonProps: { onClick: () => navigate(-1) },
        colorButton: "red",
      }}
    >
      {/* Transaction Info */}
      {transaction?.data && (
        <div className="card mb-4">
          <div className="card-header">
            <h6 className="mb-0">Informasi Transaksi</h6>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <div className="d-flex align-items-center mb-2">
                  <FiUser className="me-2" />
                  <div>
                    <strong>{transaction?.data?.customer.name}</strong>
                    <p className="text-muted mb-0">
                      {transaction?.data?.customer.email}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex align-items-center mb-2">
                  <FiTruck className="me-2" />
                  <div>
                    <strong>{transaction?.data?.customer.plate_number}</strong>
                    <p className="text-muted mb-0">
                      {transaction?.data?.customer.vehicle_type} -{" "}
                      {transaction?.data?.customer.vehicle_model}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-2">
              <label className="form-label text-muted">Keluhan:</label>
              <p>{transaction?.data?.complaint}</p>
            </div>
          </div>
        </div>
      )}

      <form className="form form-horizontal mt-4" onSubmit={handleSubmit}>
        <div className="form-body">
          <div className="row">
            {/* Title Field */}
            {!transaction?.data && (
              <TransactionSelector
                selectedTransaction={selectedTransaction}
                onTransactionSelect={handleTransactionSelect}
                onClearSelection={handleClearTransactionSelection}
                error={errors.transaction_id}
                disabled={mutation.isPending}
              />
            )}

            {/* Description Field */}
            <div className="col-md-4">
              <label htmlFor="description">Deskripsi Pekerjaan</label>
            </div>
            <div className="col-md-8 form-group">
              <textarea
                className="form-control"
                placeholder="Deskripsikan pekerjaan yang telah dilakukan..."
                id="description"
                rows={5}
                value={reportBody.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setReportBody((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                disabled={mutation.isPending}
              />
              {errors.description && (
                <small className="text-danger">{errors.description}</small>
              )}
              <small className="text-muted">
                Jelaskan secara detail pekerjaan yang telah dilakukan
              </small>
            </div>

            {/* Start Time Field */}
            <div className="col-md-4">
              <label htmlFor="start_time">Waktu Mulai</label>
            </div>
            <div className="col-md-8 form-group">
              <input
                type="datetime-local"
                className="form-control"
                id="start_time"
                value={formatDateTime(reportBody.start_time)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setReportBody((prev) => ({
                    ...prev,
                    start_time: e.target.value,
                  }))
                }
                disabled={mutation.isPending}
              />
              {errors.start_time && (
                <small className="text-danger">{errors.start_time}</small>
              )}
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm mt-1"
                onClick={() =>
                  setReportBody((prev) => ({
                    ...prev,
                    start_time: getCurrentDateTime(),
                  }))
                }
              >
                Gunakan Waktu Sekarang
              </button>
            </div>

            {/* End Time Field */}
            <div className="col-md-4">
              <label htmlFor="end_time">Waktu Selesai</label>
            </div>
            <div className="col-md-8 form-group">
              <input
                type="datetime-local"
                className="form-control"
                id="end_time"
                value={formatDateTime(reportBody.end_time)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setReportBody((prev) => ({
                    ...prev,
                    end_time: e.target.value,
                  }))
                }
                disabled={mutation.isPending}
              />
              {errors.end_time && (
                <small className="text-danger">{errors.end_time}</small>
              )}
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm mt-1"
                onClick={() =>
                  setReportBody((prev) => ({
                    ...prev,
                    end_time: getCurrentDateTime(),
                  }))
                }
              >
                Gunakan Waktu Sekarang
              </button>
            </div>

            {/* Image Field */}
            <div className="col-md-4">
              <label htmlFor="image">Foto Pekerjaan (Opsional)</label>
            </div>
            <div className="col-md-8 form-group">
              <input
                type="file"
                className="form-control"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                disabled={mutation.isPending}
              />
              {errors.image && (
                <small className="text-danger">{errors.image}</small>
              )}
              <small className="text-muted">
                Upload foto before/after atau foto progress pekerjaan
              </small>

              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-3">
                  <div className="position-relative d-inline-block">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="img-thumbnail"
                      style={{ maxWidth: "300px", maxHeight: "200px" }}
                    />
                    <button
                      type="button"
                      className="btn btn-danger rounded-full btn-sm position-absolute top-0 end-0"
                      style={{ transform: "translate(50%, -50%)" }}
                      onClick={removeImage}
                      disabled={mutation.isPending}
                    >
                      <FiX />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Submit and Reset Buttons */}
            <div className="col-12 d-flex justify-content-end">
              <button
                type="submit"
                className="btn btn-primary me-1 mb-1"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Menyimpan..." : "Simpan Draft"}
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
            <li className="mb-1">
              • Laporan akan disimpan sebagai <strong>DRAFT</strong> terlebih
              dahulu
            </li>
            <li className="mb-1">
              • Anda dapat mengedit DRAFT laporan sebelum disubmit untuk
              approval
            </li>
            <li className="mb-1">
              • Setelah disubmit, laporan akan menunggu persetujuan admin
            </li>
            <li>
              • Pastikan waktu mulai dan SELESAI sesuai dengan waktu aktual
              pekerjaan
            </li>
          </ul>
        </div>
      </div>
    </PageLayout>
  );
};
