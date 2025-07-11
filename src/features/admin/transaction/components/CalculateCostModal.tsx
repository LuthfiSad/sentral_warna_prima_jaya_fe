// @features/transaction/components/CalculateCostModal.tsx
import React, { useState, useEffect } from "react";
import { useTransactionCreation } from "../hooks/useTransaction";
import { FiDollarSign, FiFileText, FiX } from "react-icons/fi";

interface CalculateCostModalProps {
  show: boolean;
  onHide: () => void;
  transactionId: number;
  transactionData?: {
    id: number;
    customer: {
      name: string;
      plate_number: string;
    };
    reports?: Array<{
      id: number;
      description: string;
      status: string;
      employee: {
        name: string;
      };
    }>;
    current_total_cost?: number;
  };
}

export const CalculateCostModal: React.FC<CalculateCostModalProps> = ({
  show,
  onHide,
  transactionId,
  transactionData,
}) => {
  const mutation = useTransactionCreation();
  const [totalCost, setTotalCost] = useState<string>("");
  const [errors, setErrors] = useState<string>("");

  useEffect(() => {
    if (show && transactionData?.current_total_cost) {
      setTotalCost(transactionData.current_total_cost.toString());
    } else if (show) {
      setTotalCost("");
    }
    setErrors("");
  }, [show, transactionData]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatInputCurrency = (value: string) => {
    // Remove all non-numeric characters except dots and commas
    const numericValue = value.replace(/[^\d]/g, "");

    // Format with thousands separator
    return new Intl.NumberFormat("id-ID").format(parseInt(numericValue) || 0);
  };

  const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Remove all non-numeric characters
    const numericValue = value.replace(/[^\d]/g, "");
    setTotalCost(numericValue);
    setErrors("");
  };

  const handleSubmit = async () => {
    // Validation
    if (!totalCost || parseInt(totalCost) <= 0) {
      setErrors("Total biaya harus diisi dengan nilai yang valid");
      return;
    }

    const numericCost = parseInt(totalCost);
    if (numericCost < 1000) {
      setErrors("Total biaya minimal Rp 1.000");
      return;
    }

    await mutation.mutateAsync({
      type: "calculateCost",
      id: transactionId.toString(),
      data: {
        total_cost: numericCost,
      },
    });
    onHide();
    // Error akan dihandle oleh mutation
  };

  const handleClose = () => {
    setTotalCost("");
    setErrors("");
    onHide();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Get approved reports count
  const approvedReports =
    transactionData?.reports?.filter(
      (report) => report.status === "APPROVED"
    ) || [];

  if (!show) return null;

  return (
    <div
      className="modal-overlay"
      onClick={handleBackdropClick}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1050,
        padding: "20px",
      }}
    >
      <div
        className="modal-content"
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          width: "100%",
          maxWidth: "800px",
          maxHeight: "90vh",
          overflow: "auto",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          position: "relative",
        }}
      >
        {/* Modal Header */}
        <div
          className="modal-header"
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid #dee2e6",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h5
            style={{
              margin: 0,
              display: "flex",
              alignItems: "center",
              fontWeight: 600,
            }}
          >
            <FiDollarSign className="me-2" />
            Hitung Total Biaya
          </h5>
          <button
            type="button"
            onClick={handleClose}
            disabled={mutation.isPending}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              padding: "0",
              color: "#6c757d",
            }}
          >
            <FiX />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: "24px" }}>
          {/* Transaction Info */}
          <div
            className="alert alert-info"
            style={{
              padding: "16px",
              backgroundColor: "#d1ecf1",
              border: "1px solid #bee5eb",
              borderRadius: "6px",
              marginBottom: "24px",
            }}
          >
            <h6 style={{ marginBottom: "12px", fontWeight: 600 }}>
              Informasi Transaksi
            </h6>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              <div>
                <strong>Customer:</strong> {transactionData?.customer?.name}
              </div>
              <div>
                <strong>Kendaraan:</strong>{" "}
                {transactionData?.customer?.plate_number}
              </div>
            </div>
          </div>

          {/* Approved Reports Summary */}
          <div
            className="card"
            style={{
              border: "1px solid #dee2e6",
              borderRadius: "6px",
              marginBottom: "24px",
            }}
          >
            <div
              className="card-header"
              style={{
                padding: "12px 16px",
                backgroundColor: "#f8f9fa",
                borderBottom: "1px solid #dee2e6",
                borderRadius: "6px 6px 0 0",
              }}
            >
              <h6
                style={{
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  fontWeight: 600,
                }}
              >
                <FiFileText className="me-2" />
                Laporan yang Disetujui ({approvedReports.length} laporan)
              </h6>
            </div>
            <div style={{ padding: "16px" }}>
              {approvedReports.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    color: "#6c757d",
                    padding: "24px 0",
                  }}
                >
                  <p style={{ margin: "0 0 8px 0" }}>
                    Belum ada laporan yang disetujui
                  </p>
                  <small>
                    Pastikan ada laporan yang sudah diapprove sebelum menghitung
                    biaya
                  </small>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid #dee2e6" }}>
                        <th
                          style={{
                            padding: "8px 12px",
                            textAlign: "left",
                            fontWeight: 600,
                          }}
                        >
                          Deskripsi Pekerjaan
                        </th>
                        <th
                          style={{
                            padding: "8px 12px",
                            textAlign: "left",
                            fontWeight: 600,
                          }}
                        >
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {approvedReports.map((report) => (
                        <tr
                          key={report.id}
                          style={{ borderBottom: "1px solid #dee2e6" }}
                        >
                          <td style={{ padding: "8px 12px" }}>
                            {report.description}
                          </td>
                          <td style={{ padding: "8px 12px" }}>
                            {/* <span
                              style={{
                                padding: "4px 8px",
                                backgroundColor: "#d4edda",
                                color: "#155724",
                                borderRadius: "4px",
                                fontSize: "12px",
                                fontWeight: 500,
                              }}
                            >
                              Disetujui
                            </span> */}
                            {report.status}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Cost Input */}
          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="totalCost"
              style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}
            >
              Total Biaya Perbaikan
            </label>
            <div style={{ display: "flex", alignItems: "stretch" }}>
              <span
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#e9ecef",
                  border: "1px solid #ced4da",
                  borderRight: "none",
                  borderRadius: "4px 0 0 4px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Rp
              </span>
              <input
                type="text"
                id="totalCost"
                placeholder="0"
                value={formatInputCurrency(totalCost)}
                onChange={handleCostChange}
                disabled={mutation.isPending || approvedReports.length === 0}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  border: `1px solid ${errors ? "#dc3545" : "#ced4da"}`,
                  borderRadius: "0 4px 4px 0",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
            </div>
            {errors && (
              <div
                style={{ color: "#dc3545", fontSize: "14px", marginTop: "4px" }}
              >
                {errors}
              </div>
            )}
            <small
              style={{
                color: "#6c757d",
                fontSize: "12px",
                marginTop: "4px",
                display: "block",
              }}
            >
              Masukkan total biaya untuk semua pekerjaan yang telah dilakukan
            </small>
          </div>

          {/* Cost Preview */}
          {totalCost && parseInt(totalCost) > 0 && (
            <div
              style={{
                padding: "16px",
                backgroundColor: "#d4edda",
                border: "1px solid #c3e6cb",
                borderRadius: "6px",
                marginBottom: "16px",
              }}
            >
              <h6 style={{ margin: "0 0 8px 0", fontWeight: 600 }}>
                Preview Total Biaya:
              </h6>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: 600,
                  color: "#155724",
                  margin: 0,
                }}
              >
                {formatCurrency(parseInt(totalCost))}
              </div>
            </div>
          )}

          {/* Warning if no approved reports */}
          {approvedReports.length === 0 && (
            <div
              style={{
                padding: "16px",
                backgroundColor: "#fff3cd",
                border: "1px solid #ffeaa7",
                borderRadius: "6px",
                marginBottom: "16px",
              }}
            >
              <strong>Perhatian:</strong> Belum ada laporan yang disetujui untuk
              transaksi ini. Pastikan setidaknya ada satu laporan yang sudah
              diapprove sebelum menghitung biaya.
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid #dee2e6",
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
          }}
        >
          <button
            type="button"
            onClick={handleClose}
            disabled={mutation.isPending}
            style={{
              padding: "8px 16px",
              border: "1px solid #6c757d",
              backgroundColor: "#6c757d",
              color: "white",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              mutation.isPending ||
              approvedReports.length === 0 ||
              !totalCost ||
              parseInt(totalCost) <= 0
            }
            style={{
              padding: "8px 16px",
              border: "1px solid #007bff",
              backgroundColor:
                mutation.isPending ||
                approvedReports.length === 0 ||
                !totalCost ||
                parseInt(totalCost) <= 0
                  ? "#6c757d"
                  : "#007bff",
              color: "white",
              borderRadius: "4px",
              cursor:
                mutation.isPending ||
                approvedReports.length === 0 ||
                !totalCost ||
                parseInt(totalCost) <= 0
                  ? "not-allowed"
                  : "pointer",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
            }}
          >
            {mutation.isPending ? (
              <>
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    border: "2px solid transparent",
                    borderTop: "2px solid white",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                    marginRight: "8px",
                  }}
                ></span>
                Menyimpan...
              </>
            ) : (
              <>
                <FiDollarSign style={{ marginRight: "8px" }} />
                Simpan Biaya
              </>
            )}
          </button>
        </div>
      </div>

      {/* CSS for spinner animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
