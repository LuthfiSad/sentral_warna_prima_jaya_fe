import React, { useState } from "react";
import { PageLayout } from "@features/admin/components/PageLayout";
import { useNavigate } from "react-router-dom";
import { useEmployeeCreation } from "../hooks/useEmployee";
import { CustomApiError } from "@features/_global/types/CustomApiError";
import { FiX } from "react-icons/fi";

interface EmployeeCreateDTO {
  name: string;
  email: string;
  date_of_birth: string;
  address: string;
  divisi: string;
  image?: File;
}

const InitialValue: EmployeeCreateDTO = {
  name: "",
  email: "",
  date_of_birth: "",
  address: "",
  divisi: "",
};

export const EmployeeFormAdd: React.FC = () => {
  const mutation = useEmployeeCreation();

  const [employeeBody, setEmployeeBody] = useState<EmployeeCreateDTO>({
    ...InitialValue,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<
    Partial<Record<keyof EmployeeCreateDTO, string>>
  >({});

  const navigate = useNavigate();

  const validate = () => {
    const newErrors: Partial<Record<keyof EmployeeCreateDTO, string>> = {};
    let isValid = true;

    if (!employeeBody.name) {
      newErrors.name = "Nama wajib diisi";
      isValid = false;
    }

    if (!employeeBody.email) {
      newErrors.email = "Email wajib diisi";
      isValid = false;
    }

    if (!employeeBody.date_of_birth) {
      newErrors.date_of_birth = "Tanggal lahir wajib diisi";
      isValid = false;
    }

    if (!employeeBody.address) {
      newErrors.address = "Alamat wajib diisi";
      isValid = false;
    }

    if (!employeeBody.divisi) {
      newErrors.divisi = "Divisi wajib diisi";
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
      formData.append("name", employeeBody.name);
      formData.append("email", employeeBody.email);
      formData.append("date_of_birth", employeeBody.date_of_birth);
      formData.append("address", employeeBody.address);
      formData.append("divisi", employeeBody.divisi);
      
      if (employeeBody.image) {
        formData.append("image", employeeBody.image);
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
    setEmployeeBody(InitialValue);
    setImagePreview(null);
    setErrors({});
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEmployeeBody(prev => ({
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
    setEmployeeBody(prev => ({
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
      title="Tambah Karyawan"
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
            {/* Name Field */}
            <div className="col-md-4">
              <label htmlFor="name">Nama</label>
            </div>
            <div className="col-md-8 form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Nama"
                id="name"
                value={employeeBody.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmployeeBody((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                disabled={mutation.isPending}
              />
              {errors.name && (
                <small className="text-danger">{errors.name}</small>
              )}
            </div>

            {/* Email Field */}
            <div className="col-md-4">
              <label htmlFor="email">Email</label>
            </div>
            <div className="col-md-8 form-group">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                id="email"
                value={employeeBody.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmployeeBody((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                disabled={mutation.isPending}
              />
              {errors.email && (
                <small className="text-danger">{errors.email}</small>
              )}
            </div>

            {/* Date of Birth Field */}
            <div className="col-md-4">
              <label htmlFor="date_of_birth">Tanggal Lahir</label>
            </div>
            <div className="col-md-8 form-group">
              <input
                type="date"
                className="form-control"
                id="date_of_birth"
                value={employeeBody.date_of_birth}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmployeeBody((prev) => ({
                    ...prev,
                    date_of_birth: e.target.value,
                  }))
                }
                disabled={mutation.isPending}
              />
              {errors.date_of_birth && (
                <small className="text-danger">{errors.date_of_birth}</small>
              )}
            </div>

            {/* Address Field */}
            <div className="col-md-4">
              <label htmlFor="address">Alamat</label>
            </div>
            <div className="col-md-8 form-group">
              <textarea
                className="form-control"
                placeholder="Alamat"
                id="address"
                rows={3}
                value={employeeBody.address}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setEmployeeBody((prev) => ({
                    ...prev,
                    address: e.target.value,
                  }))
                }
                disabled={mutation.isPending}
              />
              {errors.address && (
                <small className="text-danger">{errors.address}</small>
              )}
            </div>

            {/* Division Field */}
            <div className="col-md-4">
              <label htmlFor="divisi">Divisi</label>
            </div>
            <div className="col-md-8 form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Divisi"
                id="divisi"
                value={employeeBody.divisi}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmployeeBody((prev) => ({
                    ...prev,
                    divisi: e.target.value,
                  }))
                }
                disabled={mutation.isPending}
              />
              {errors.divisi && (
                <small className="text-danger">{errors.divisi}</small>
              )}
            </div>

            {/* Image Field */}
            <div className="col-md-4">
              <label htmlFor="image">Foto</label>
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
                      style={{ maxWidth: '200px', maxHeight: '200px' }}
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