import { StbModel } from "@core/model/stb";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useStbCreation } from "../../hooks/useStb";

interface IStbItemProps extends StbModel {
  show?: boolean;
  handleDelete: (id: string) => void;
}

export const TableItem: React.FC<IStbItemProps> = ({
  id,
  serialNumber,
  type,
  deviceId,
  numberWo,
  unitAddress,
  packageName,
  dateActivation,
  status,
  deviceLocation,
  location,
  information,
  notes,
  show,
  handleDelete,
}) => {
  const mutation = useStbCreation();
  const nav = useNavigate();

  const handleChange = async (id: string, change: string) => {
    await mutation.mutateAsync({
      type: "update",
      data: {
        deviceLocation: change,
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
        <span className="text-xs font-semibold text-secondary">{deviceId}</span>
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
        <span className="text-xs font-semibold text-secondary">
          {packageName}
        </span>
      </td>
      <td className="py-3 px-5">
        <span className="text-xs font-semibold text-secondary">
          {new Date(dateActivation).toLocaleDateString()}
        </span>
      </td>
      <td className="py-3 px-5">
        <span className="text-xs font-semibold text-secondary">{status}</span>
      </td>
      <td className="py-3 px-5">
        <span
          className={`py-1 px-3 rounded text-[11px] font-medium text-white ${
            deviceLocation === "Active"
              ? "bg-warning"
              : deviceLocation === "Ready"
              ? "bg-success"
              : "bg-danger"
          }`}
        >
          {deviceLocation}
        </span>
      </td>
      <td className="py-3 px-5">
        <span className="text-xs font-semibold text-secondary">
          {location?.location}
        </span>
      </td>
      <td className="py-3 px-5">
        <span className="text-xs font-semibold text-secondary">
          {information || "-"}
        </span>
      </td>
      <td className="py-3 px-5">
        <span className="text-xs font-semibold text-secondary">
          {notes || "-"}
        </span>
      </td>
      <td className="py-3 px-5">
        <div className="d-flex align-items-center gap-2">
          {deviceLocation !== "Active" && (
            <button
              className="btn btn-success btn-sm font-semibold"
              onClick={() => {
                const confirm = window.confirm(
                  "Are you sure you want to change active device location this set top box?"
                );
                if (!confirm) return;
                handleChange(id, "Active");
              }}
            >
              Active
            </button>
          )}
          {deviceLocation !== "Ready" && (
            <button
              className="btn btn-warning btn-sm font-semibold"
              onClick={() => {
                const confirm = window.confirm(
                  "Are you sure you want to change ready device location this set top box?"
                );
                if (!confirm) return;
                handleChange(id, "Ready");
              }}
            >
              Ready
            </button>
          )}
          {deviceLocation !== "Back" && (
            <button
              className="btn btn-danger btn-sm font-semibold"
              onClick={() => {
                const confirm = window.confirm(
                  "Are you sure you want to change back device location this set top box?"
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
            onClick={() => nav(`/stb/edit/${id}`)}
          >
            Edit
          </button>
          <button
            className="btn btn-link p-0 text-danger text-xs font-semibold"
            onClick={() => {
              const confirm = window.confirm(
                "Are you sure you want to delete this set top box?"
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
