// @features/transaction/components/TransactionFormAdd.tsx - Updated with total_cost field
import React, { useState, useEffect, useRef } from "react";
import { PageLayout } from "@features/admin/components/PageLayout";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CustomApiError } from "@features/_global/types/CustomApiError";
import { useTransactionCreation } from "../hooks/useTransaction";
import { TransactionCreateDTO } from "@core/model/transaction";
import { CustomerModel } from "@core/model/customer";
import { FiSearch, FiUser, FiTruck, FiChevronDown, FiX, FiDollarSign } from "react-icons/fi";
import { useCustomer } from "@features/admin/customer/hooks/useCustomer";

const InitialValue: TransactionCreateDTO = {
  customer_id: 0,
  complaint: "",
  total_cost: 0,
};

export const TransactionFormAdd: React.FC = () => {
  const mutation = useTransactionCreation();
  const { data: customersData, isLoading: customersLoading } = useCustomer({ 
    perPage: 9999,
    search: ""
  });
  const [searchParams] = useSearchParams();

  const [transactionBody, setTransactionBody] = useState<TransactionCreateDTO>({
    ...InitialValue,
  });
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerModel | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof TransactionCreateDTO | "customer_id", string>>
  >({});

  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Auto-load customer if customer_id is provided in URL
  useEffect(() => {
    const customerId = searchParams.get("customer_id");
    if (customerId && customersData?.data) {
      const customer = customersData.data.find((c: CustomerModel) => c.id === parseInt(customerId));
      if (customer) {
        setSelectedCustomer(customer);
        setTransactionBody(prev => ({
          ...prev,
          customer_id: customer.id,
        }));
      }
    }
  }, [searchParams, customersData]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const validate = () => {
    const newErrors: Partial<Record<keyof TransactionCreateDTO | "customer_id", string>> = {};
    let isValid = true;

    if (!selectedCustomer) {
      newErrors.customer_id = "Customer wajib dipilih";
      isValid = false;
    }

    if (!transactionBody.complaint.trim()) {
      newErrors.complaint = "Keluhan wajib diisi";
      isValid = false;
    }

    if (transactionBody.total_cost < 0) {
      newErrors.total_cost = "Total biaya tidak boleh negatif";
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
        type: "create",
        data: transactionBody,
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
    setTransactionBody(InitialValue);
    setSelectedCustomer(null);
    setSearchTerm("");
    setErrors({});
  };

  const handleCustomerSelect = (customer: CustomerModel) => {
    setSelectedCustomer(customer);
    setTransactionBody(prev => ({
      ...prev,
      customer_id: customer.id,
    }));
    setSearchTerm("");
    setIsDropdownOpen(false);
    setErrors(prev => ({ ...prev, customer_id: undefined }));
  };

  const clearSelection = () => {
    setSelectedCustomer(null);
    setTransactionBody(prev => ({
      ...prev,
      customer_id: 0,
    }));
    setSearchTerm("");
  };

  const filteredCustomers = customersData?.data?.filter((customer: CustomerModel) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      customer.name.toLowerCase().includes(searchLower) ||
      customer.plate_number.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower) ||
      customer.phone.includes(searchTerm) ||
      customer.vehicle_type.toLowerCase().includes(searchLower) ||
      customer.vehicle_model.toLowerCase().includes(searchLower)
    );
  }) || [];

  const handleInputFocus = () => {
    setIsDropdownOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsDropdownOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <PageLayout
      title="Tambah Transaksi Perbaikan"
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
            {/* Customer Selection Section */}
            <div className="col-12">
              <div className="card mb-4">
                <div className="card-header">
                  <h6 className="mb-0">
                    <FiSearch className="me-2" />
                    Pilih Customer
                  </h6>
                </div>
                <div className="card-body">
                  {!selectedCustomer ? (
                    <div className="row">
                      <div className="col-md-4">
                        <label htmlFor="customer_search">Cari Customer</label>
                      </div>
                      <div className="col-md-8 form-group">
                        <div className="position-relative" ref={dropdownRef}>
                          <div className="input-group">
                            <input
                              type="text"
                              className={`form-control ${errors.customer_id ? 'is-invalid' : ''}`}
                              id="customer_search"
                              placeholder="Cari berdasarkan nama, plat nomor, email, atau telepon..."
                              value={searchTerm}
                              onChange={handleInputChange}
                              onFocus={handleInputFocus}
                              disabled={customersLoading || mutation.isPending}
                            />
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                              disabled={customersLoading || mutation.isPending}
                            >
                              <FiChevronDown className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                          </div>
                          
                          {errors.customer_id && (
                            <div className="invalid-feedback d-block">{errors.customer_id}</div>
                          )}

                          {/* Dropdown Menu */}
                          {isDropdownOpen && (
                            <div className="dropdown-menu show w-100 mt-1" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                              {customersLoading ? (
                                <div className="dropdown-item text-center">
                                  <small className="text-muted">Memuat data customer...</small>
                                </div>
                              ) : filteredCustomers.length === 0 ? (
                                <div className="dropdown-item text-center">
                                  <small className="text-muted">
                                    {searchTerm ? 'Tidak ada customer yang sesuai' : 'Belum ada data customer'}
                                  </small>
                                  <div className="mt-2">
                                    <button
                                      type="button"
                                      className="btn btn-sm btn-primary"
                                      onClick={() => navigate('/dashboard/customer/create')}
                                    >
                                      Tambah Customer Baru
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                filteredCustomers.slice(0, 10).map((customer: CustomerModel) => (
                                  <button
                                    key={customer.id}
                                    type="button"
                                    className="dropdown-item d-flex justify-content-between align-items-start py-2"
                                    onClick={() => handleCustomerSelect(customer)}
                                  >
                                    <div className="flex-grow-1">
                                      <div className="d-flex align-items-center mb-1">
                                        <FiUser className="me-2 text-primary" />
                                        <strong>{customer.name}</strong>
                                      </div>
                                      <div className="d-flex align-items-center mb-1">
                                        <FiTruck className="me-2 text-secondary" />
                                        <span className="text-primary fw-bold">{customer.plate_number}</span>
                                        <span className="text-muted ms-2">
                                          {customer.vehicle_type} - {customer.vehicle_model}
                                        </span>
                                      </div>
                                      <small className="text-muted">
                                        {customer.email} • {customer.phone}
                                      </small>
                                    </div>
                                  </button>
                                ))
                              )}
                              
                              {filteredCustomers.length > 10 && (
                                <div className="dropdown-item text-center">
                                  <small className="text-muted">
                                    Menampilkan 10 dari {filteredCustomers.length} hasil. Ketik untuk mempersempit pencarian.
                                  </small>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <small className="text-muted">
                          Ketik nama, plat nomor, email, atau nomor telepon untuk mencari customer
                        </small>
                      </div>
                    </div>
                  ) : (
                    <div className="row">
                      <div className="col-md-6">
                        <div className="d-flex align-items-center justify-content-between">
                          <div>
                            <h6 className="mb-1">
                              <FiUser className="me-2" />
                              {selectedCustomer.name}
                            </h6>
                            <p className="text-muted mb-1">{selectedCustomer.email}</p>
                            <p className="text-muted mb-0">{selectedCustomer.phone}</p>
                          </div>
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            onClick={clearSelection}
                          >
                            <FiX className="me-1" />
                            Ganti Customer
                          </button>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <h6 className="mb-1">
                          <FiTruck className="me-2" />
                          {selectedCustomer.plate_number}
                        </h6>
                        <p className="text-muted mb-1">
                          {selectedCustomer.vehicle_type} - {selectedCustomer.vehicle_model}
                        </p>
                        <p className="text-muted mb-0">Tahun: {selectedCustomer.vehicle_year}</p>
                        <button
                          type="button"
                          className="btn btn-outline-info btn-sm mt-2"
                          onClick={() => navigate(`/dashboard/customer/detail/${selectedCustomer.id}`)}
                        >
                          Lihat Detail Customer
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

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

            {/* Total Cost Field */}
            <div className="col-md-4">
              <label htmlFor="total_cost">Total Biaya Estimasi</label>
            </div>
            <div className="col-md-8 form-group">
              <div className="input-group">
                <span className="input-group-text">
                  <FiDollarSign />
                </span>
                <input
                  type="number"
                  className={`form-control ${errors.total_cost ? 'is-invalid' : ''}`}
                  id="total_cost"
                  placeholder="0"
                  min="0"
                  step="1000"
                  value={transactionBody.total_cost}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setTransactionBody((prev) => ({
                      ...prev,
                      total_cost: parseFloat(e.target.value) || 0,
                    }))
                  }
                  disabled={mutation.isPending}
                />
                <span className="input-group-text">IDR</span>
              </div>
              {errors.total_cost && (
                <small className="text-danger">{errors.total_cost}</small>
              )}
              <small className="text-muted">
                Estimasi biaya perbaikan. Format: {formatCurrency(transactionBody.total_cost)}
              </small>
            </div>

            {/* Submit and Reset Buttons */}
            <div className="col-12 d-flex justify-content-end">
              <button
                type="submit"
                className="btn btn-primary me-1 mb-1"
                disabled={mutation.isPending || !selectedCustomer}
              >
                {mutation.isPending ? "Menyimpan..." : "Buat Transaksi"}
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
            <li className="mb-1">• Transaksi akan dibuat dengan status <strong>PENDING</strong></li>
            <li className="mb-1">• Total biaya dapat disesuaikan selama proses pengerjaan</li>
            <li className="mb-1">• Karyawan dapat memulai pengerjaan setelah transaksi dibuat</li>
            <li className="mb-1">• Customer baru dapat didaftarkan melalui tombol "Tambah Customer Baru"</li>
            <li>• Pastikan keluhan dan estimasi biaya dideskripsikan dengan jelas</li>
          </ul>
        </div>
      </div>

      {/* Custom CSS for dropdown animation */}
      <style>{`
        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          z-index: 1000;
          display: block;
          min-width: 100%;
          padding: 0.5rem 0;
          margin: 0.125rem 0 0;
          font-size: 0.875rem;
          color: #212529;
          text-align: left;
          list-style: none;
          background-color: #fff;
          background-clip: padding-box;
          border: 1px solid rgba(0, 0, 0, 0.15);
          border-radius: 0.375rem;
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
        }
        
        .dropdown-item {
          display: block;
          width: 100%;
          padding: 0.25rem 1rem;
          clear: both;
          font-weight: 400;
          color: #212529;
          text-align: inherit;
          text-decoration: none;
          white-space: nowrap;
          background-color: transparent;
          border: 0;
        }
        
        .dropdown-item:hover {
          color: #1e2125;
          background-color: #e9ecef;
        }
        
        .transition-transform {
          transition: transform 0.2s ease-in-out;
        }
        
        .rotate-180 {
          transform: rotate(180deg);
        }
      `}</style>
    </PageLayout>
  );
};