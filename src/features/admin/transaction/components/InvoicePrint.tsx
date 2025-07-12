// @features/transaction/components/InvoicePrint.tsx
import React from "react";
import logo from "@core/assets/logo.jpeg";

interface InvoicePrintProps {
  transactionData: {
    id: number;
    complaint: string;
    status: string;
    created_at: string;
    updated_at: string;
    total_cost: number;
    customer: {
      name: string;
      email: string;
      phone: string;
      plate_number: string;
      vehicle_type: string;
      vehicle_model: string;
      vehicle_year: string;
      address: string;
    };
    reports: Array<{
      id: number;
      description: string;
      start_time: string;
      end_time: string;
      status: string;
      employee: {
        name: string;
        divisi: string;
      };
    }>;
  };
  onClose: () => void;
}

export const InvoicePrint: React.FC<InvoicePrintProps> = ({ transactionData, onClose }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="invoice-container">
      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            margin: 0; /* Atur margin halaman cetak */
            size: auto; /* atau gunakan 'A4 portrait' jika perlu */
          }

          body * {
            visibility: hidden;
          }
          .invoice-container, .invoice-container * {
            visibility: visible;
          }
          .invoice-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
          .invoice-content {
            max-width: 120mm;
            margin: 0 auto;
            padding: 0mm;
            font-size: 12px;
            line-height: 1.4;
          }
        }
        
        @media screen {
          .invoice-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .invoice-content {
            background: white;
            max-width: 210mm;
            max-height: 90vh;
            overflow-y: auto;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            font-size: 14px;
            line-height: 1.5;
          }
        }
        
        .invoice-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #007bff;
        }
        
        .company-info {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .company-logo {
          width: 60px;
          height: 60px;
          object-fit: contain;
        }
        
        .company-details h2 {
          margin: 0;
          color: #007bff;
          font-size: 20px;
          font-weight: bold;
        }
        
        .company-details p {
          margin: 2px 0;
          color: #666;
          font-size: 12px;
        }
        
        .invoice-title {
          text-align: right;
        }
        
        .invoice-title h1 {
          margin: 0;
          color: #333;
          font-size: 24px;
          font-weight: bold;
        }
        
        .invoice-number {
          color: #666;
          font-size: 14px;
          margin-top: 5px;
        }
        
        .invoice-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-bottom: 30px;
        }
        
        .customer-info, .transaction-info {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 5px;
        }
        
        .section-title {
          font-weight: bold;
          color: #007bff;
          margin-bottom: 10px;
          font-size: 16px;
        }
        
        .info-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          padding-bottom: 5px;
          border-bottom: 1px dotted #ddd;
        }
        
        .info-label {
          font-weight: 500;
          color: #555;
        }
        
        .info-value {
          color: #333;
          text-align: right;
        }
        
        .services-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        
        .services-table th,
        .services-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        
        .services-table th {
          background: #007bff;
          color: white;
          font-weight: bold;
        }
        
        .services-table tr:nth-child(even) {
          background: #f8f9fa;
        }
        
        .total-section {
          text-align: right;
          margin-top: 20px;
        }
        
        .total-row {
          display: flex;
          justify-content: flex-end;
          gap: 50px;
          margin-bottom: 10px;
          padding: 10px 0;
        }
        
        .total-final {
          border-top: 2px solid #007bff;
          font-weight: bold;
          font-size: 18px;
          color: #007bff;
        }
        
        .footer {
          margin-top: 40px;
          text-align: center;
          color: #666;
          font-size: 12px;
          border-top: 1px solid #ddd;
          padding-top: 20px;
        }
        
        .action-buttons {
          position: absolute;
          top: 20px;
          right: 20px;
          display: flex;
          gap: 10px;
        }
        
        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        }
        
        .btn-primary {
          background: #007bff;
          color: white;
        }
        
        .btn-secondary {
          background: #6c757d;
          color: white;
        }
        
        .btn:hover {
          opacity: 0.9;
        }
      `}</style>

      <div className="invoice-overlay">
        <div className="invoice-content">
          {/* Action Buttons (Hidden on print) */}
          <div className="action-buttons no-print">
            <button className="btn btn-primary" onClick={handlePrint}>
              🖨️ Cetak
            </button>
            <button className="btn btn-secondary" onClick={onClose}>
              ✕ Tutup
            </button>
          </div>

          {/* Invoice Header */}
          <div className="invoice-header">
            <div className="company-info">
              <img src={logo} alt="Company Logo" className="company-logo" />
              <div className="company-details">
                <h2>Sentral Warna Prima Jaya</h2>
                <p>Jl. Raya Industri No. 123</p>
                <p>Jakarta Timur, 13920</p>
                <p>Telp: (021) 123-4567</p>
                <p>Email: info@sentralwarna.com</p>
              </div>
            </div>
            <div className="invoice-title">
              <h1>INVOICE</h1>
              <div className="invoice-number">No. INV-{transactionData.id.toString().padStart(4, '0')}</div>
              <div className="invoice-number">Tanggal: {formatDate(transactionData.updated_at)}</div>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="invoice-details">
            <div className="customer-info">
              <div className="section-title">Informasi Pelanggan</div>
              <div className="info-row">
                <span className="info-label">Nama:</span>
                <span className="info-value">{transactionData.customer.name}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email:</span>
                <span className="info-value">{transactionData.customer.email}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Telepon:</span>
                <span className="info-value">{transactionData.customer.phone}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Alamat:</span>
                <span className="info-value">{transactionData.customer.address}</span>
              </div>
            </div>

            <div className="transaction-info">
              <div className="section-title">Informasi Kendaraan</div>
              <div className="info-row">
                <span className="info-label">No. Polisi:</span>
                <span className="info-value">{transactionData.customer.plate_number}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Jenis:</span>
                <span className="info-value">{transactionData.customer.vehicle_type}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Model:</span>
                <span className="info-value">{transactionData.customer.vehicle_model}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Tahun:</span>
                <span className="info-value">{transactionData.customer.vehicle_year}</span>
              </div>
            </div>
          </div>

          {/* Services Table */}
          <table className="services-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Deskripsi Pekerjaan</th>
                <th>Teknisi</th>
                <th>Divisi</th>
                <th>Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {transactionData.reports.map((report, index) => (
                <tr key={report.id}>
                  <td>{index + 1}</td>
                  <td>{report.description}</td>
                  <td>{report.employee.name}</td>
                  <td>{report.employee.divisi}</td>
                  <td>{formatDate(report.end_time)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Complaint/Problem */}
          <div className="complaint-section">
            <div className="section-title">Keluhan/Masalah Awal</div>
            <p>{transactionData.complaint}</p>
          </div>

          {/* Total Section */}
          <div className="total-section">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>{formatCurrency(transactionData.total_cost)}</span>
            </div>
            <div className="total-row">
              <span>PPN (0%):</span>
              <span>{formatCurrency(0)}</span>
            </div>
            <div className="total-row total-final">
              <span>Total:</span>
              <span>{formatCurrency(transactionData.total_cost)}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="footer">
            <p><strong>Terima kasih atas kepercayaan Anda!</strong></p>
            <p>Invoice ini dicetak pada {formatDateTime(new Date().toISOString())}</p>
          </div>
        </div>
      </div>
    </div>
  );
};