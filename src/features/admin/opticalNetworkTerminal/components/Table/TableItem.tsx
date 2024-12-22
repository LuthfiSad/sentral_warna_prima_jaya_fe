import { OntModel } from "@core/model/ont";
import React from "react";

interface IOntItemProps extends OntModel {
  show?: boolean;
  handleDelete: (id: string) => void;
}

export const TableItem: React.FC<IOntItemProps> = ({
  id,
  serialNumber,
  type,
  numberWo,
  unitAddress,
  name,
  dateActivation,
  status,
  information,
  show,
  handleDelete,
}) => {
  return (
    <tr key={id} className={`${show ? "border-b border-secondary" : ""}`}>
      <td className="py-3 px-5">
        <span className="text-xs font-semibold text-secondary">
          {serialNumber}
        </span>
      </td>
      <td className="py-3 px-5">
        <span className="text-xs font-semibold text-secondary">{type}</span>
      </td>
      <td className="py-3 px-5">
        <span className="text-xs font-semibold text-secondary">{numberWo}</span>
      </td>
      <td className="py-3 px-5">
        <span className="text-xs font-semibold text-secondary">
          {unitAddress}
        </span>
      </td>
      <td className="py-3 px-5">
        <span className="text-xs font-semibold text-secondary">{name}</span>
      </td>
      <td className="py-3 px-5">
        <span className="text-xs font-semibold text-secondary">
          {new Date(dateActivation).toLocaleDateString()}
        </span>
      </td>
      <td className="py-3 px-5">
        <span
          className={`py-1 px-3 rounded text-[11px] font-medium text-white ${
            status === "Active"
              ? "bg-warning"
              : status === "Ready"
              ? "bg-success"
              : "bg-danger"
          }`}
        >
          {status}
        </span>
      </td>
      <td className="py-3 px-5">
        <span className="text-xs font-semibold text-secondary">
          {information || "-"}
        </span>
      </td>
      <td className="py-3 px-5">
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-link p-0 text-danger text-xs font-semibold"
            onClick={() => {
              const confirm = window.confirm(
                "Are you sure you want to delete this optical network terminal?"
              );
              if (!confirm) return;
              handleDelete(id);
            }}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};
