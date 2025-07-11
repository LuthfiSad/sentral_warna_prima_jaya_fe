import React, { useState, useEffect, useRef } from "react";
import { FiSearch, FiChevronDown, FiX, FiUser, FiTruck, FiClock, FiAlertCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { TransactionModel } from "@core/model/transaction";
import { useTransaction } from "@features/admin/transaction/hooks/useTransaction";

interface TransactionSelectorProps {
  selectedTransaction: TransactionModel | null;
  onTransactionSelect: (transaction: TransactionModel) => void;
  onClearSelection: () => void;
  error?: string;
  disabled?: boolean;
}

export const TransactionSelector: React.FC<TransactionSelectorProps> = ({
  selectedTransaction,
  onTransactionSelect,
  onClearSelection,
  error,
  disabled = false
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fetch transactions with PENDING status
  const { data: transactionsData, isLoading: transactionsLoading } = useTransaction({
    search: 'selected',
    status: "PENDING", // Only show PENDING transactions
    perPage: 9999999,
  });

  const transactions = transactionsData?.data || [];

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter((transaction: TransactionModel) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      transaction.customer.name.toLowerCase().includes(searchLower) ||
      transaction.customer.plate_number.toLowerCase().includes(searchLower) ||
      transaction.customer.email.toLowerCase().includes(searchLower) ||
      transaction.customer.phone.toLowerCase().includes(searchLower) ||
      transaction.complaint.toLowerCase().includes(searchLower) ||
      transaction.id.toString().includes(searchLower)
    );
  });

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsDropdownOpen(true);
  };

  // Handle input focus
  const handleInputFocus = () => {
    setIsDropdownOpen(true);
  };

  // Handle transaction selection
  const handleTransactionSelect = (transaction: TransactionModel) => {
    onTransactionSelect(transaction);
    setIsDropdownOpen(false);
    setSearchTerm("");
  };

  // Handle clear selection
  const clearSelection = () => {
    onClearSelection();
    setSearchTerm("");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-warning';
      case 'in_progress':
        return 'bg-info';
      case 'completed':
        return 'bg-success';
      case 'cancelled':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <div className="col-12">
      <div className="card mb-4">
        <div className="card-header">
          <h6 className="mb-0">
            <FiSearch className="me-2" />
            Pilih Transaksi
          </h6>
        </div>
        <div className="card-body">
          {!selectedTransaction ? (
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="transaction_search">Cari Transaksi</label>
              </div>
              <div className="col-md-8 form-group">
                <div className="position-relative" ref={dropdownRef}>
                  <div className="input-group">
                    <input
                      type="text"
                      className={`form-control ${error ? 'is-invalid' : ''}`}
                      id="transaction_search"
                      placeholder="Cari berdasarkan ID, nama customer, plat nomor, atau keluhan..."
                      value={searchTerm}
                      onChange={handleInputChange}
                      onFocus={handleInputFocus}
                      disabled={transactionsLoading || disabled}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      disabled={transactionsLoading || disabled}
                    >
                      <FiChevronDown className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                  
                  {error && (
                    <div className="invalid-feedback d-block">{error}</div>
                  )}

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="dropdown-menu show w-100 mt-1" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                      {transactionsLoading ? (
                        <div className="dropdown-item text-center">
                          <small className="text-muted">Memuat data transaksi...</small>
                        </div>
                      ) : filteredTransactions.length === 0 ? (
                        <div className="dropdown-item text-center">
                          <small className="text-muted">
                            {searchTerm ? 'Tidak ada transaksi yang sesuai' : 'Belum ada transaksi PENDING'}
                          </small>
                          <div className="mt-2">
                            <button
                              type="button"
                              className="btn btn-sm btn-primary"
                              onClick={() => navigate('/dashboard/transaction/create')}
                            >
                              Buat Transaksi Baru
                            </button>
                          </div>
                        </div>
                      ) : (
                        filteredTransactions.slice(0, 10).map((transaction: TransactionModel) => (
                          <button
                            key={transaction.id}
                            type="button"
                            className="dropdown-item d-flex justify-content-between align-items-start py-3"
                            onClick={() => handleTransactionSelect(transaction)}
                          >
                            <div className="flex-grow-1">
                              <div className="d-flex align-items-center justify-content-between mb-2">
                                <div className="d-flex align-items-center">
                                  <FiAlertCircle className="me-2 text-primary" />
                                  <strong>ID: #{transaction.id}</strong>
                                </div>
                                <span className={`badge ${getStatusBadgeColor(transaction.status)} text-white`}>
                                  {transaction.status.replace('_', ' ').toUpperCase()}
                                </span>
                              </div>
                              
                              <div className="d-flex align-items-center mb-2">
                                <FiUser className="me-2 text-secondary" />
                                <span className="fw-bold">{transaction.customer.name}</span>
                                <span className="text-muted ms-2">({transaction.customer.email})</span>
                              </div>
                              
                              <div className="d-flex align-items-center mb-2">
                                <FiTruck className="me-2 text-secondary" />
                                <span className="text-primary fw-bold">{transaction.customer.plate_number}</span>
                                <span className="text-muted ms-2">
                                  {transaction.customer.vehicle_type} - {transaction.customer.vehicle_model}
                                </span>
                              </div>
                              
                              <div className="d-flex align-items-center mb-2">
                                <FiClock className="me-2 text-secondary" />
                                <small className="text-muted">{formatDate(transaction.created_at)}</small>
                              </div>
                              
                              <div className="mt-2">
                                <label className="form-label text-muted small mb-1">Keluhan:</label>
                                <p className="mb-0 small text-truncate" style={{ maxWidth: '400px' }}>
                                  {transaction.complaint}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))
                      )}
                      
                      {filteredTransactions.length > 10 && (
                        <div className="dropdown-item text-center">
                          <small className="text-muted">
                            Menampilkan 10 dari {filteredTransactions.length} hasil. Ketik untuk mempersempit pencarian.
                          </small>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <small className="text-muted">
                  Ketik ID transaksi, nama customer, plat nomor, atau keluhan untuk mencari transaksi
                </small>
              </div>
            </div>
          ) : (
            <div className="row">
              <div className="col-md-6">
                <div className="d-flex align-items-start justify-content-between">
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center mb-2">
                      <FiAlertCircle className="me-2 text-primary" />
                      <h6 className="mb-0">Transaksi #{selectedTransaction.id}</h6>
                      <span className={`badge ${getStatusBadgeColor(selectedTransaction.status)} text-white ms-2`}>
                        {selectedTransaction.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="d-flex align-items-center mb-2">
                      <FiUser className="me-2 text-secondary" />
                      <div>
                        <strong>{selectedTransaction.customer.name}</strong>
                        <p className="text-muted mb-0 small">{selectedTransaction.customer.email}</p>
                      </div>
                    </div>
                    
                    <div className="d-flex align-items-center mb-2">
                      <FiClock className="me-2 text-secondary" />
                      <small className="text-muted">{formatDate(selectedTransaction.created_at)}</small>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={clearSelection}
                    disabled={disabled}
                  >
                    <FiX className="me-1" />
                    Ganti Transaksi
                  </button>
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="d-flex align-items-center mb-2">
                  <FiTruck className="me-2 text-secondary" />
                  <div>
                    <h6 className="mb-0">{selectedTransaction.customer.plate_number}</h6>
                    <p className="text-muted mb-0 small">
                      {selectedTransaction.customer.vehicle_type} - {selectedTransaction.customer.vehicle_model}
                    </p>
                  </div>
                </div>
                
                <div className="mt-3">
                  <label className="form-label text-muted small mb-1">Keluhan:</label>
                  <p className="mb-2 small">{selectedTransaction.complaint}</p>
                </div>
                
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-info btn-sm"
                    onClick={() => navigate(`/dashboard/transaction/${selectedTransaction.id}`)}
                  >
                    Lihat Detail Transaksi
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => navigate(`/dashboard/customer/${selectedTransaction.customer.id}`)}
                  >
                    Lihat Detail Customer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};