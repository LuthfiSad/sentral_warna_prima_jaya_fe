import React, { useEffect, useState } from "react";
import { PageLayout } from "@features/admin/components/PageLayout";
import { useNavigate, useParams } from "react-router-dom";
import { useReportById, useReportCreation } from "../hooks/useReport";
import { CustomApiError } from "@features/_global/types/CustomApiError";
import { ReportModel } from "@core/model/report";
import LoadingData from "@features/_global/components/LoadingData";
import { FiX } from "react-icons/fi";

interface ReportUpdateDTO {
  date: string;
  report: string;
  customer_name: string;
  vehicle_type: string;
  total_repairs: number;
  cost: number;
  image?: File;
}

const InitialValue: ReportUpdateDTO = {
  date: "",
  report: "",
  customer_name: "",
  vehicle_type: "",
  total_repairs: 0,
  cost: 0,
};

export const ReportFormUpdate: React.FC = () => {
  const { id } = useParams();
  const mutation = useReportCreation();

  const [reportBody, setReportBody] = useState<ReportUpdateDTO>({
    ...InitialValue,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ReportUpdateDTO, string>>
  >({});

  const { data: reportById, isLoading } = useReportById();
  
  useEffect(() => {
    if (reportById && reportById.data) {
      handleSetReportBody(reportById.data);
    }
  }, [reportById]);

  const handleSetReportBody = (data: ReportModel) => {
    const { date, report, customer_name, vehicle_type, total_repairs, cost, image_url } = data;
    setReportBody({
      date,
      report,
      customer_name,
      vehicle_type,
      total_repairs,
      cost,
    });
    
    // Set current image URL for preview
    if (image_url) {
      setCurrentImageUrl(image_url);
    }
  };

  const navigate = useNavigate();

  const validate = () => {
    const newErrors: Partial<Record<keyof ReportUpdateDTO, string>> = {};
    let isValid = true;

    if (!reportBody.date) {
      newErrors.date = "Tanggal wajib diisi";
      isValid = false;
    }

    if (!reportBody.report) {
      newErrors.report = "Laporan wajib diisi";
      isValid = false;
    }

    if (!reportBody.customer_name) {
      newErrors.customer_name = "Nama pelanggan wajib diisi";
      isValid = false;
    }

    if (!reportBody.vehicle_type) {
      newErrors.vehicle_type = "Jenis kendaraan wajib diisi";
      isValid = false;
    }

    if (!reportBody.total_repairs || reportBody.total_repairs <= 0) {
      newErrors.total_repairs = "Total perbaikan harus lebih dari 0";
      isValid = false;
    }

    if (!reportBody.cost || reportBody.cost <= 0) {
      newErrors.cost = "Biaya harus lebih dari 0";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    
    try {
      const formData = new FormData();
      formData.append("date", reportBody.date);
      formData.append("report", reportBody.report);
      formData.append("customer_name", reportBody.customer_name);
      formData.append("vehicle_type", reportBody.vehicle_type);
      formData.append("total_repairs", reportBody.total_repairs.toString());
      formData.append("cost", reportBody.cost.toString());
      
      if (reportBody.image) {
        formData.append("image", reportBody.image);
      }

      await mutation.mutateAsync({
        type: "update",
        data: formData,
        id,
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
      handleSetReportBody(reportById.data);
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

  const handleNumberChange = (
    field: 'total_repairs' | 'cost',
    value: string
  ) => {
    const numValue = parseFloat(value) || 0;
    setReportBody(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
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

  return (
    <PageLayout
      title="Ubah Laporan"
      headBackground="blue"
      action={{
        show: true,
        buttonTitle: "Cancel",
        buttonProps: { onClick: () => navigate(-1) },
        colorButton: "red",
      }}
    >
      {isLoading && <LoadingData />}
      {!isLoading && (
        <form className="form form-horizontal mt-4" onSubmit={handleSubmit}>
          <div className="form-body">
            <div className="row">
              {/* Date Field */}
              <div className="col-md-4">
                <label htmlFor="date">Tanggal</label>
              </div>
              <div className="col-md-8 form-group">
                <input
                  type="date"
                  className="form-control"
                  id="date"
                  value={reportBody.date}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setReportBody((prev) => ({
                      ...prev,
                      date: e.target.value,
                    }))
                  }
                  disabled={mutation.isPending}
                />
                {errors.date && (
                  <small className="text-danger">{errors.date}</small>
                )}
              </div>

              {/* Customer Name Field */}
              <div className="col-md-4">
                <label htmlFor="customer_name">Nama Pelanggan</label>
              </div>
              <div className="col-md-8 form-group">
                <input
                  type="text"
                  className="form-control"
                  id="customer_name"
                  placeholder="Masukkan nama pelanggan"
                  value={reportBody.customer_name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setReportBody((prev) => ({
                      ...prev,
                      customer_name: e.target.value,
                    }))
                  }
                  disabled={mutation.isPending}
                />
                {errors.customer_name && (
                  <small className="text-danger">{errors.customer_name}</small>
                )}
              </div>

              {/* Vehicle Type Field */}
              <div className="col-md-4">
                <label htmlFor="vehicle_type">Jenis Kendaraan</label>
              </div>
              <div className="col-md-8 form-group">
                <select
                  className="form-control"
                  id="vehicle_type"
                  value={reportBody.vehicle_type}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setReportBody((prev) => ({
                      ...prev,
                      vehicle_type: e.target.value,
                    }))
                  }
                  disabled={mutation.isPending}
                >
                  <option value="">Pilih jenis kendaraan</option>
                  <option value="Motor">Motor</option>
                  <option value="Mobil">Mobil</option>
                  <option value="Truk">Truk</option>
                  <option value="Bus">Bus</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
                {errors.vehicle_type && (
                  <small className="text-danger">{errors.vehicle_type}</small>
                )}
              </div>

              {/* Total Repairs Field */}
              <div className="col-md-4">
                <label htmlFor="total_repairs">Total Perbaikan</label>
              </div>
              <div className="col-md-8 form-group">
                <input
                  type="number"
                  className="form-control"
                  id="total_repairs"
                  placeholder="Masukkan jumlah perbaikan"
                  min="1"
                  value={reportBody.total_repairs || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleNumberChange('total_repairs', e.target.value)
                  }
                  disabled={mutation.isPending}
                />
                {errors.total_repairs && (
                  <small className="text-danger">{errors.total_repairs}</small>
                )}
              </div>

              {/* Cost Field */}
              <div className="col-md-4">
                <label htmlFor="cost">Biaya</label>
              </div>
              <div className="col-md-8 form-group">
                <input
                  type="number"
                  className="form-control"
                  id="cost"
                  placeholder="Masukkan biaya"
                  min="0"
                  step="0.01"
                  value={reportBody.cost || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleNumberChange('cost', e.target.value)
                  }
                  disabled={mutation.isPending}
                />
                {reportBody.cost > 0 && (
                  <small className="text-muted">
                    {formatCurrency(reportBody.cost)}
                  </small>
                )}
                {errors.cost && (
                  <small className="text-danger">{errors.cost}</small>
                )}
              </div>

              {/* Report Field */}
              <div className="col-md-4">
                <label htmlFor="report">Laporan</label>
              </div>
              <div className="col-md-8 form-group">
                <textarea
                  className="form-control"
                  placeholder="Tulis laporan Anda di sini..."
                  id="report"
                  rows={5}
                  value={reportBody.report}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setReportBody((prev) => ({
                      ...prev,
                      report: e.target.value,
                    }))
                  }
                  disabled={mutation.isPending}
                />
                {errors.report && (
                  <small className="text-danger">{errors.report}</small>
                )}
              </div>

              {/* Image Field */}
              <div className="col-md-4">
                <label htmlFor="image">Gambar</label>
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
                  Kosongkan jika tidak ingin mengubah gambar
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
                        {displayImage.isNew ? 'Gambar baru (belum disimpan)' : 'Gambar saat ini'}
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
                  Submit
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
      )}
    </PageLayout>
  );
};