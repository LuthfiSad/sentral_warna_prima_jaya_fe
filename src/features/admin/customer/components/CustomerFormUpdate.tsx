// @features/customer/components/CustomerFormUpdate.tsx
import React, { useEffect, useState } from "react";
import { PageLayout } from "@features/admin/components/PageLayout";
import { useNavigate } from "react-router-dom";
import { useCustomerById, useCustomerCreation } from "../hooks/useCustomer";
import { CustomApiError } from "@features/_global/types/CustomApiError";
import { CustomerUpdateDTO } from "@core/model/customer";
import LoadingData from "@features/_global/components/LoadingData";

const InitialValue: CustomerUpdateDTO = {
  name: "",
  address: "",
  phone: "",
  email: "",
  plate_number: "",
  vehicle_type: "",
  vehicle_model: "",
  vehicle_year: "",
};

export const CustomerFormUpdate: React.FC = () => {
  const mutation = useCustomerCreation();
  const { data: customerById, isLoading } = useCustomerById();

  const [customerBody, setCustomerBody] = useState<CustomerUpdateDTO>({
    ...InitialValue,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof CustomerUpdateDTO, string>>
  >({});

  const navigate = useNavigate();

  useEffect(() => {
    if (customerById && customerById.data) {
      const { name, address, phone, email, plate_number, vehicle_type, vehicle_model, vehicle_year } = customerById.data;
      setCustomerBody({
        name,
        address,
        phone,
        email,
        plate_number,
        vehicle_type,
        vehicle_model,
        vehicle_year,
      });
    }
  }, [customerById]);

  const validate = () => {
    const newErrors: Partial<Record<keyof CustomerUpdateDTO, string>> = {};
    let isValid = true;

    if (!customerBody.name) {
      newErrors.name = "Nama wajib diisi";
      isValid = false;
    }

    if (!customerBody.address) {
      newErrors.address = "Alamat wajib diisi";
      isValid = false;
    }

    if (!customerBody.phone) {
      newErrors.phone = "Nomor HP wajib diisi";
      isValid = false;
    }

    if (!customerBody.email) {
      newErrors.email = "Email wajib diisi";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(customerBody.email)) {
      newErrors.email = "Format email tidak valid";
      isValid = false;
    }

    if (!customerBody.plate_number) {
      newErrors.plate_number = "Plat nomor wajib diisi";
      isValid = false;
    }

    if (!customerBody.vehicle_type) {
      newErrors.vehicle_type = "Jenis kendaraan wajib diisi";
      isValid = false;
    }

    if (!customerBody.vehicle_model) {
      newErrors.vehicle_model = "Model kendaraan wajib diisi";
      isValid = false;
    }

    if (!customerBody.vehicle_year) {
      newErrors.vehicle_year = "Tahun kendaraan wajib diisi";
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
        data: customerBody,
        id: customerById?.data?.id.toString(),
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
    if (customerById && customerById.data) {
      const { name, address, phone, email, plate_number, vehicle_type, vehicle_model, vehicle_year } = customerById.data;
      setCustomerBody({
        name,
        address,
        phone,
        email,
        plate_number,
        vehicle_type,
        vehicle_model,
        vehicle_year,
      });
    } else {
      setCustomerBody(InitialValue);
    }
    setErrors({});
  };

  const vehicleTypes = [
    "Motor",
    "Mobil",
    "Truk",
    "Bus",
    "Pickup",
    "Van",
    "Lainnya",
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <PageLayout
      title="Ubah Customer"
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
              {/* Name Field */}
              <div className="col-md-4">
                <label htmlFor="name">Nama Lengkap</label>
              </div>
              <div className="col-md-8 form-group">
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="Masukkan nama lengkap"
                  value={customerBody.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCustomerBody((prev) => ({
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
                  id="email"
                  placeholder="Masukkan email"
                  value={customerBody.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCustomerBody((prev) => ({
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

              {/* Phone Field */}
              <div className="col-md-4">
                <label htmlFor="phone">Nomor HP</label>
              </div>
              <div className="col-md-8 form-group">
                <input
                  type="text"
                  className="form-control"
                  id="phone"
                  placeholder="Masukkan nomor HP"
                  value={customerBody.phone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCustomerBody((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  disabled={mutation.isPending}
                />
                {errors.phone && (
                  <small className="text-danger">{errors.phone}</small>
                )}
              </div>

              {/* Address Field */}
              <div className="col-md-4">
                <label htmlFor="address">Alamat</label>
              </div>
              <div className="col-md-8 form-group">
                <textarea
                  className="form-control"
                  placeholder="Masukkan alamat lengkap"
                  id="address"
                  rows={3}
                  value={customerBody.address}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setCustomerBody((prev) => ({
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

              {/* Plate Number Field */}
              <div className="col-md-4">
                <label htmlFor="plate_number">Plat Nomor</label>
              </div>
              <div className="col-md-8 form-group">
                <input
                  type="text"
                  className="form-control"
                  id="plate_number"
                  placeholder="Contoh: B1234ABC"
                  value={customerBody.plate_number}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCustomerBody((prev) => ({
                      ...prev,
                      plate_number: e.target.value.toUpperCase(),
                    }))
                  }
                  disabled={mutation.isPending}
                />
                {errors.plate_number && (
                  <small className="text-danger">{errors.plate_number}</small>
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
                  value={customerBody.vehicle_type}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setCustomerBody((prev) => ({
                      ...prev,
                      vehicle_type: e.target.value,
                    }))
                  }
                  disabled={mutation.isPending}
                >
                  <option value="">Pilih jenis kendaraan</option>
                  {vehicleTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.vehicle_type && (
                  <small className="text-danger">{errors.vehicle_type}</small>
                )}
              </div>

              {/* Vehicle Model Field */}
              <div className="col-md-4">
                <label htmlFor="vehicle_model">Model Kendaraan</label>
              </div>
              <div className="col-md-8 form-group">
                <input
                  type="text"
                  className="form-control"
                  id="vehicle_model"
                  placeholder="Contoh: Toyota Avanza"
                  value={customerBody.vehicle_model}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCustomerBody((prev) => ({
                      ...prev,
                      vehicle_model: e.target.value,
                    }))
                  }
                  disabled={mutation.isPending}
                />
                {errors.vehicle_model && (
                  <small className="text-danger">{errors.vehicle_model}</small>
                )}
              </div>

              {/* Vehicle Year Field */}
              <div className="col-md-4">
                <label htmlFor="vehicle_year">Tahun Kendaraan</label>
              </div>
              <div className="col-md-8 form-group">
                <select
                  className="form-control"
                  id="vehicle_year"
                  value={customerBody.vehicle_year}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setCustomerBody((prev) => ({
                      ...prev,
                      vehicle_year: e.target.value,
                    }))
                  }
                  disabled={mutation.isPending}
                >
                  <option value="">Pilih tahun</option>
                  {years.map((year) => (
                    <option key={year} value={year.toString()}>
                      {year}
                    </option>
                  ))}
                </select>
                {errors.vehicle_year && (
                  <small className="text-danger">{errors.vehicle_year}</small>
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