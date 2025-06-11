import { EmployeeModel } from "@core/model/employee";
import React from "react";
import { useNavigate } from "react-router-dom";

interface IEmployeeItemProps extends EmployeeModel {
  show?: boolean;
  handleDelete: (id: string) => void;
}

export const TableItem: React.FC<IEmployeeItemProps> = ({
  id,
  name,
  email,
  date_of_birth,
  address,
  divisi,
  image_url,
  show,
  handleDelete,
}) => {
  const nav = useNavigate();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <tr key={id} className={`${show ? "border-b border-secondary" : ""}`}>
      <td className="py-3">
        <div className="d-flex align-items-center">
          {image_url ? (
            <img
              src={image_url}
              alt={name}
              className="rounded-lg"
              style={{ width: '100%', height: '100px', objectFit: 'cover' }}
            />
          ) : (
            <div 
              className="rounded-lg bg-secondary d-flex align-items-center justify-content-center text-white"
              style={{ width: '100%', height: '100px' }}
            >
              <span className="text-xs font-semibold">
                {name?.charAt(0)?.toUpperCase() || "?"}
              </span>
            </div>
          )}
        </div>
      </td>
      <td className="py-3 px-5">
        <span className="text-xs font-semibold text-secondary">
          {name || "-"}
        </span>
      </td>
      <td className="py-3 px-5">
        <span className="text-xs font-semibold text-secondary">
          {email || "-"}
        </span>
      </td>
      <td className="py-3 px-5">
        <span className="text-xs font-semibold text-secondary">
          {date_of_birth ? formatDate(date_of_birth) : "-"}
        </span>
      </td>
      <td className="py-3 px-5">
        <span className="text-xs font-semibold text-secondary">
          {address || "-"}
        </span>
      </td>
      <td className="py-3 px-5">
        <span
          // className={`py-1 px-3 rounded text-[11px] font-medium text-white ${
          //   divisi === "Admin"
          //     ? "bg-success"
          //     : divisi === "HR"
          //     ? "bg-info"
          //     : divisi === "IT"
          //     ? "bg-primary"
          //     : divisi === "Finance"
          //     ? "bg-warning"
          //     : divisi === "Marketing"
          //     ? "bg-danger"
          //     : "bg-secondary"
          // }`}
          className="py-1 px-3 rounded text-[11px] font-medium text-white bg-info"
        >
          {divisi || "-"}
        </span>
      </td>
      <td className="py-3 px-5">
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-link p-0 text-warning text-xs font-semibold"
            onClick={() => nav(`/employee/edit/${id}`)}
          >
            Ubah
          </button>
          <button
            className="btn btn-link p-0 text-danger text-xs font-semibold"
            onClick={() => {
              const confirm = window.confirm(
                "Apakah Anda yakin ingin menghapus karyawan ini?"
              );
              if (!confirm) return;
              handleDelete(id);
            }}
          >
            Hapus
          </button>
        </div>
      </td>
    </tr>
  );
};