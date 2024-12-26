import { CableModel } from "@core/model/cable";
import React from "react";
import { useNavigate } from "react-router-dom";

interface ICableItemProps extends CableModel {
  show?: boolean;
}

export const TableItem: React.FC<ICableItemProps> = ({
  id,
  size,
  quantity,
  location,
  show,
}) => {
  const nav = useNavigate();
  return (
    <tr key={id} className={`${show ? "border-b border-secondary" : ""}`}>
      <td className="py-3 px-5">
        <span className="text-xs font-semibold text-secondary">
          {size || "-"}
        </span>
      </td>
      <td className="py-3 px-5">
        <span className="text-xs font-semibold text-secondary">{quantity}</span>
      </td>
      <td className="py-3 px-5">
        <span className="text-xs font-semibold text-secondary">
          {location?.location}
        </span>
      </td>
      <td className="py-3 px-5">
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-link p-0 text-warning text-xs font-semibold"
            onClick={() => nav(`/admin/cable/edit/${id}`)}
          >
            Edit
          </button>
        </div>
      </td>
    </tr>
  );
};
