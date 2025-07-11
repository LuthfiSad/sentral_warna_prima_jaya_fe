// @features/customer/components/Table/TableItem.tsx
import { CustomerModel } from "@core/model/customer";
import { UserModel } from "@core/model/user";
import React from "react";
import { Link } from "react-router-dom";

interface ICustomerItemProps extends CustomerModel {
  show?: boolean;
  linkUpdate: string;
  linkDetail: string;
  handleDelete: (id: string) => void;
  dataUser: UserModel;
}

export const TableItem: React.FC<ICustomerItemProps> = ({
  id,
  name,
  address,
  phone,
  email,
  plate_number,
  vehicle_type,
  vehicle_model,
  vehicle_year,
  created_at,
  show,
  linkUpdate,
  linkDetail,
  handleDelete,
  dataUser,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const truncateText = (text: string, maxLength: number = 30) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <tr key={id} className={`${show ? "border-b border-secondary" : ""}`}>
      {/* Customer Name */}
      <td className="py-3 px-3">
        <div className="d-flex flex-column">
          <span className="text-sm font-semibold text-dark" title={name}>
            {truncateText(name)}
          </span>
          <span className="text-xs text-muted">{email}</span>
        </div>
      </td>

      {/* Contact Info */}
      <td className="py-3 px-3">
        <div className="d-flex flex-column">
          <span className="text-xs font-semibold text-secondary">{phone}</span>
          <span className="text-xs text-muted" title={address}>
            {truncateText(address, 25)}
          </span>
        </div>
      </td>

      {/* Vehicle Info */}
      <td className="py-3 px-3">
        <div className="d-flex flex-column">
          <span className="text-sm font-semibold text-dark">{plate_number}</span>
          <span className="text-xs text-muted">
            {vehicle_type} - {vehicle_model} ({vehicle_year})
          </span>
        </div>
      </td>

      {/* Registration Date */}
      <td className="py-3 px-3">
        <span className="text-xs font-semibold text-secondary">
          {formatDate(created_at)}
        </span>
      </td>

      {/* Actions */}
      <td className="py-3 px-5">
        <div className="d-flex align-items-center gap-2">
          <Link to={linkDetail}>
            <button className="btn btn-link p-0 text-info text-xs font-semibold">
              Detail
            </button>
          </Link>
          
          {dataUser?.is_admin && (
            <>
              <Link to={linkUpdate}>
                <button className="btn btn-link p-0 text-warning text-xs font-semibold">
                  Ubah
                </button>
              </Link>
              
              <button
                className="btn btn-link p-0 text-danger text-xs font-semibold"
                onClick={() => {
                  const confirm = window.confirm(
                    "Apakah Anda yakin ingin menghapus customer ini?"
                  );
                  if (!confirm) return;
                  handleDelete(id.toString());
                }}
              >
                Hapus
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};