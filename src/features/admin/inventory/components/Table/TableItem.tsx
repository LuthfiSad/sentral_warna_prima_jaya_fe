import { InventoryModel } from "@core/model/inventory";
import React from "react";
import { useNavigate } from "react-router-dom";

interface IInventoryItemProps extends InventoryModel {
  show?: boolean;
  handleDelete: (id: string) => void;
}

export const TableItem: React.FC<IInventoryItemProps> = ({
  id,
  itemName,
  unit,
  quantity,
  damagedQuantity,
  goodQuantity,
  information,
  notes,
  show,
  handleDelete,
}) => {
  const nav = useNavigate();
  return (
    <tr key={id} className={`${show ? "border-b border-secondary" : ""}`}>
      <td className="py-3 px-5">
        <span className="text-xs font-semibold text-secondary">{itemName}</span>
      </td>
      <td className="py-3 px-5">
        <span className="text-xs font-semibold text-secondary">{unit}</span>
      </td>
      <td className="py-3 px-5">
        <span className="text-xs font-semibold text-secondary">{quantity}</span>
      </td>
      <td className="py-3 px-5">
        <span className="py-1 px-3 rounded text-[11px] font-medium text-white bg-success">
          {goodQuantity}
        </span>
      </td>
      <td className="py-3 px-5">
        <span className="py-1 px-3 rounded text-[11px] font-medium text-white bg-danger">
          {damagedQuantity}
        </span>
      </td>
      <td className="py-3 px-5">
        <span className="text-xs font-semibold text-secondary">
          {information}
        </span>
      </td>
      <td className="py-3 px-5">
        <span className="text-xs font-semibold text-secondary">{notes}</span>
      </td>
      <td className="py-3 px-5">
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-link p-0 text-warning text-xs font-semibold"
            onClick={() => nav(`/inventory/edit/${id}`)}
          >
            Ubah
          </button>
          <button
            className="btn btn-link p-0 text-danger text-xs font-semibold"
            onClick={() => {
              const confirm = window.confirm(
                "Are you sure you want to delete this Inventory?"
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
