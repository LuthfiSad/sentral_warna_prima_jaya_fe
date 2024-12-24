import { OntModel } from "@core/model/ont";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useOntCreation } from "../../hooks/useOnt";

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
  const mutation = useOntCreation();
  const nav = useNavigate();

  const handleChange = async (id: string, change: string) => {
    await mutation.mutateAsync({
      type: "update",
      data: {
        status: change,
      },
      id,
    });
  };
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
          {status !== "Active" && (
            <button
              className="btn btn-success btn-sm font-semibold"
              onClick={() => {
                const confirm = window.confirm(
                  "Are you sure you want to change active status this optical network terminal?"
                );
                if (!confirm) return;
                handleChange(id, "Active");
              }}
            >
              Active
            </button>
          )}
          {status !== "Ready" && (
            <button
              className="btn btn-warning btn-sm font-semibold"
              onClick={() => {
                const confirm = window.confirm(
                  "Are you sure you want to change ready status this optical network terminal?"
                );
                if (!confirm) return;
                handleChange(id, "Ready");
              }}
            >
              Ready
            </button>
          )}
          {status !== "Back" && (
            <button
              className="btn btn-danger btn-sm font-semibold"
              onClick={() => {
                const confirm = window.confirm(
                  "Are you sure you want to change back status this optical network terminal?"
                );
                if (!confirm) return;
                handleChange(id, "Back");
              }}
            >
              Back
            </button>
          )}
        </div>
      </td>
      <td className="py-3 px-5">
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-link p-0 text-warning text-xs font-semibold"
            onClick={() => nav(`/admin/ont/edit/${id}`)}
          >
            Edit
          </button>
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
