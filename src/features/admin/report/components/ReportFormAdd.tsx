import React, { useState } from "react";
import { PageLayout } from "@features/admin/components/PageLayout";
import { useNavigate } from "react-router-dom";
import { CustomApiError } from "@features/_global/types/CustomApiError";
import { FiX } from "react-icons/fi";
import { useReportCreation } from "../hooks/useReport";

interface ReportCreateDTO {
  date: string;
  report: string;
  image?: File;
}

const InitialValue: ReportCreateDTO = {
  date: "",
  report: "",
};

export const ReportFormAdd: React.FC = () => {
  const mutation = useReportCreation();

  const [reportBody, setReportBody] = useState<ReportCreateDTO>({
    ...InitialValue,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ReportCreateDTO, string>>
  >({});

  const navigate = useNavigate();

  const validate = () => {
    const newErrors: Partial<Record<keyof ReportCreateDTO, string>> = {};
    let isValid = true;

    if (!reportBody.date) {
      newErrors.date = "Tanggal wajib diisi";
      isValid = false;
    }

    if (!reportBody.report) {
      newErrors.report = "Laporan wajib diisi";
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
    setReportBody(InitialValue);
    setImagePreview(null);
    setErrors({});
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReportBody(prev => ({
        ...prev,
        image: file
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

  return (
    <PageLayout
      title="Tambah Laporan"
      headBackground="blue"
      action={{
        show: true,
        buttonTitle: "Cancel",
        buttonProps: { onClick: () => navigate(-1) },
        colorButton: "red",
      }}
    >
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
              <label htmlFor="image">Gambar (Opsional)</label>
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
              
              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-3">
                  <div className="position-relative d-inline-block">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="img-thumbnail"
                      style={{ maxWidth: '300px', maxHeight: '200px' }}
                    />
                    <button
                      type="button"
                      className="btn btn-danger rounded-full btn-sm position-absolute top-0 end-0"
                      style={{ transform: 'translate(50%, -50%)' }}
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
    </PageLayout>
  );
};