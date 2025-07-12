// @features/report/components/ReportFormUpdate.tsx - Updated for new flow
import React, { useEffect, useState } from "react";
import { PageLayout } from "@features/admin/components/PageLayout";
import { useNavigate } from "react-router-dom";
import { useReportById, useReportCreation } from "../hooks/useReport";
import { CustomApiError } from "@features/_global/types/CustomApiError";
import { ReportUpdateDTO } from "@core/model/report";
import LoadingData from "@features/_global/components/LoadingData";
import { FiX, FiTruck, FiUser, FiClock } from "react-icons/fi";
import { dataUserAtom } from "@features/admin/store/dataUser";
import { useAtom } from "jotai";

const InitialValue: ReportUpdateDTO = {
  description: "",
  start_time: "",
  end_time: "",
};

export const ReportFormUpdate: React.FC = () => {
  const mutation = useReportCreation();
  const { data: reportById, isLoading } = useReportById();
  const [dataUser] = useAtom(dataUserAtom);

  const [reportBody, setReportBody] = useState<ReportUpdateDTO>({
    ...InitialValue,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ReportUpdateDTO, string>>
  >({});

  const navigate = useNavigate();

  useEffect(() => {
    if (reportById && reportById.data) {
      const { description, start_time, end_time, image_url } = reportById.data;
      setReportBody({
        description,
        start_time,
        end_time,
      });
      
      // Set current image URL for preview
      if (image_url) {
        setCurrentImageUrl(image_url);
      }
    }
  }, [reportById]);

  const validate = () => {
    const newErrors: Partial<Record<keyof ReportUpdateDTO, string>> = {};
    let isValid = true;

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
      formData.append("description", reportBody.description || "");
      formData.append("start_time", reportBody.start_time || "");
      formData.append("end_time", reportBody.end_time || "");
      
      if (reportBody.image) {
        formData.append("image", reportBody.image);
      }

      await mutation.mutateAsync({
        type: "update",
        data: formData,
        id: reportById?.data?.id.toString(),
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
    if (reportById && reportById.data) {
      const { description, start_time, end_time, image_url } = reportById.data;
      setReportBody({
        description,
        start_time,
        end_time,
      });
      
      if (image_url) {
        setCurrentImageUrl(image_url);
      }
    } else {
      setReportBody(InitialValue);
      setCurrentImageUrl(null);
    }
    setImagePreview(null);
    setErrors({});
    
    // Reset file input
    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReportBody(prev => ({
        ...prev,
        image: file
      }));

      // Create preview for new image
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setReportBody(prev => ({
      ...prev,
      image: undefined
    }));
    setImagePreview(null);
    
    // Reset file input
    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const removeCurrentImage = () => {
    setCurrentImageUrl(null);
  };

  const formatDateTime = (dateTimeString: string) => {
    if (!dateTimeString) return "";
    return dateTimeString.slice(0, 16); // Format for datetime-local input
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    return formatDateTime(now.toISOString());
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "success";
      case "REJECTED":
        return "danger";
      case "PENDING":
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
      case "PENDING":
        return "Pending";
      default:
        return status;
    }
  };

  // Determine which image to show: new preview, current image, or none
  const getDisplayImage = () => {
    if (imagePreview) {
      return { src: imagePreview, isNew: true };
    }
    if (currentImageUrl) {
      return { src: currentImageUrl, isNew: false };
    }
    return null;
  };

  const displayImage = getDisplayImage();

  if (isLoading) {
    return (
      <PageLayout
        title="Edit Laporan"
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

  if (!reportById?.data) {
    return (
      <PageLayout
        title="Edit Laporan"
        headBackground="blue"
        action={{
          show: true,
          buttonTitle: "Cancel",
          buttonProps: { onClick: () => navigate(-1) },
          colorButton: "red",
        }}
      >
        <div className="alert alert-danger">Laporan tidak ditemukan</div>
      </PageLayout>
    );
  }

  const report = reportById.data;
  const canEdit = report.status === "PENDING" || report.status === "REJECTED" || dataUser?.is_admin;

  if (!canEdit) {
    return (
      <PageLayout
        title="Edit Laporan"
        headBackground="blue"
        action={{
          show: true,
          buttonTitle: "Kembali",
          buttonProps: { onClick: () => navigate(-1) },
          colorButton: "secondary",
        }}
      >
        <div className="alert alert-warning">
          Laporan dengan status "{getStatusText(report.status)}" tidak dapat diedit
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={`Edit Laporan #${report.id}`}
      headBackground="blue"
      action={{
        show: true,
        buttonTitle: "Cancel",
        buttonProps: { onClick: () => navigate(-1) },
        colorButton: "red",
      }}
    >
      {/* Report Info */}
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h6 className="mb-0">Informasi Laporan</h6>
          <span className={`badge bg-${getStatusColor(report.status)}`}>
            {getStatusText(report.status)}
          </span>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label text-muted">
                  <FiUser className="me-1" />
                  Customer
                </label>
                <p className="h6">{report.transaction.customer.name}</p>
                <p className="text-muted mb-0">
                  <FiTruck className="me-1" />
                  {report.transaction.customer.plate_number} - {report.transaction.customer.vehicle_type}
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label text-muted">Transaksi & Keluhan</label>
                <p className="h6">#{report.transaction.id}</p>
                <p className="text-muted mb-0">{report.transaction.complaint}</p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label text-muted">
                  <FiClock className="me-1" />
                  Dibuat
                </label>
                <p>{formatDate(report.created_at)}</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label text-muted">Karyawan</label>
                <p>{report.employee.name}</p>
              </div>
            </div>
          </div>
          {report.status === "REJECTED" && report.rejection_reason && (
            <div className="alert alert-danger">
              <strong>Alasan Penolakan:</strong> {report.rejection_reason}
            </div>
          )}
        </div>
      </div>

      <form className="form form-horizontal mt-4" onSubmit={handleSubmit}>
        <div className="form-body">
          <div className="row">
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
                value={formatDateTime(reportBody.start_time || "")}
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
                onClick={() => setReportBody(prev => ({
                  ...prev,
                  start_time: getCurrentDateTime()
                }))}
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
                value={formatDateTime(reportBody.end_time || "")}
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
                onClick={() => setReportBody(prev => ({
                  ...prev,
                  end_time: getCurrentDateTime()
                }))}
              >
                Gunakan Waktu Sekarang
              </button>
            </div>

            {/* Image Field */}
            <div className="col-md-4">
              <label htmlFor="image">Foto Pekerjaan</label>
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
                Kosongkan jika tidak ingin mengubah foto
              </small>
              
              {/* Image Preview */}
              {displayImage && (
                <div className="mt-3">
                  <div className="position-relative d-inline-block">
                    <img
                      src={displayImage.src}
                      alt={displayImage.isNew ? "New Preview" : "Current Image"}
                      className="img-thumbnail"
                      style={{ maxWidth: '300px', maxHeight: '200px' }}
                    />
                    <button
                      type="button"
                      className="btn btn-sm rounded-full btn-danger position-absolute top-0 end-0"
                      style={{ transform: 'translate(50%, -50%)' }}
                      onClick={displayImage.isNew ? removeImage : removeCurrentImage}
                      disabled={mutation.isPending}
                    >
                      <FiX />
                    </button>
                  </div>
                  <div className="mt-1">
                    <small className={`text-${displayImage.isNew ? 'primary' : 'muted'}`}>
                      {displayImage.isNew ? 'Foto baru (belum disimpan)' : 'Foto saat ini'}
                    </small>
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

      {/* Action Buttons for Draft Reports */}
      {report.status === "PENDING" && !dataUser?.is_admin && (
        <div className="card mt-4">
          <div className="card-body">
            <h6 className="card-title">Aksi Laporan</h6>
            <div className="d-flex gap-2">
              <button
                className="btn btn-success"
                onClick={async () => {
                  const confirm = window.confirm(
                    "Apakah Anda yakin ingin menyetujui laporan? Setelah diapprove, laporan tidak dapat diedit."
                  );
                  if (!confirm) return;
                  
                  await mutation.mutateAsync({
                    type: "approve",
                    id: report.id.toString(),
                  });
                }}
                disabled={mutation.isPending}
              >
                Approve
              </button>
              <button
                className="btn btn-danger"
                onClick={async () => {
                  // const confirm = window.confirm(
                  //   "Apakah Anda yakin ingin menolak laporan ini?"
                  // );
                  // if (!confirm) return;
                  const reason = prompt("Masukkan alasan penolakan:");
                  if (!reason) return;
                  
                  await mutation.mutateAsync({
                    type: "reject",
                    id: report.id.toString(),
                    data: { reason },
                  });
                }}
                disabled={mutation.isPending}
              >
                Reject
              </button>
            </div>
            <small className="text-muted">
              Pastikan semua data sudah benar sebelum submit untuk approval
            </small>
          </div>
        </div>
      )}

      {/* Info Card */}
      <div className="card mt-4">
        <div className="card-body">
          <h6 className="card-title">Informasi</h6>
          <ul className="list-unstyled mb-0">
            <li className="mb-1">• Laporan <strong>PENDING</strong> dapat diedit kapan saja</li>
            <li className="mb-1">• Laporan <strong>DITOLAK</strong> dapat diedit dan disubmit ulang</li>
            <li className="mb-1">• Laporan <strong>MENUNGGU APPROVAL</strong> tidak dapat diedit</li>
            <li>• Laporan <strong>DISETUJUI</strong> tidak dapat diedit (hanya admin)</li>
          </ul>
        </div>
      </div>
    </PageLayout>
  );
};