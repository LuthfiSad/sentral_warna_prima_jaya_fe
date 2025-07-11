import { UserModel } from "@core/model/user";
import React from "react";
import { useNavigate } from "react-router-dom";

interface IUserItemProps extends UserModel {
  show?: boolean;
  handleDelete: (id: string) => void;
  handleResetPassword: () => void;
}

export const TableItem: React.FC<IUserItemProps> = ({
  id,
  email,
  username,
  is_admin,
  show,
  handleDelete,
  handleResetPassword,
}) => {
  const nav = useNavigate();
  return (
    <tr key={id} className={`${show ? "border-b border-secondary" : ""}`}>
      <td className="py-3 px-5">
        <span className="text-xs font-semibold text-secondary">
          {username || "-"}
        </span>
      </td>
      <td className="py-3 px-5">
        <span className="text-xs font-semibold text-secondary">
          {email || "-"}
        </span>
      </td>
      <td className="py-3 px-5">
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={handleResetPassword}
        >
          Reset Password
        </button>
      </td>
      <td className="py-3 px-5">
        <span
          className={`py-1 px-3 rounded text-[11px] font-medium text-white ${
            is_admin
              ? "bg-success"
              : "bg-secondary"
          }`}
        >
          {is_admin ? "PERSONALIA" : "KARYAWAN"}
        </span>
      </td>
      <td className="py-3 px-5">
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-link p-0 text-warning text-xs font-semibold"
            onClick={() => nav(`/dashboard/user/edit/${id}`)}
          >
            Ubah
          </button>
          <button
            className="btn btn-link p-0 text-danger text-xs font-semibold"
            onClick={() => {
              const confirm = window.confirm(
                "Are you sure you want to delete this user?"
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