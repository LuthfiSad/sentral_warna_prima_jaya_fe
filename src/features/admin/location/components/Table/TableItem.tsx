import { LocationModel } from "@core/model/location";
import React from "react";
import { useNavigate } from "react-router-dom";

interface ILocationItemProps extends LocationModel {
  show?: boolean;
  handleDelete: (id: string) => void;
}

export const TableItem: React.FC<ILocationItemProps> = ({
  id,
  location,
  show,
}) => {
  const nav = useNavigate();
  return (
    <tr key={id} className={`${show ? "border-b border-secondary" : ""}`}>
      <td className="py-3 px-5">
        <span className="text-xs font-semibold text-secondary">{location}</span>
      </td>
      <td className="py-3 px-5">
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-primary btn-sm font-semibold"
            onClick={() => nav(`/ont/${id}`)}
          >
            ONT
          </button>
          <button
            className="btn btn-primary btn-sm font-semibold"
            onClick={() => nav(`/stb/${id}`)}
          >
            STB
          </button>
          <button
            className="btn btn-primary btn-sm font-semibold"
            onClick={() => nav(`/cable/${id}`)}
          >
            KABEL
          </button>
        </div>
      </td>
      <td className="py-3 px-5">
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-link p-0 text-warning text-xs font-semibold"
            onClick={() => nav(`/location/edit/${id}`)}
          >
            Ubah
          </button>
        </div>
      </td>
    </tr>
  );
};
