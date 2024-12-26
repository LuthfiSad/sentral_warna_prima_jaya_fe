import { HistoryModel } from "@core/model/history";
import React from "react";

interface IHistoryItemProps extends HistoryModel {
  show?: boolean;
}

export const TableItem: React.FC<IHistoryItemProps> = ({
  id,
  keyword,
  activity,
  ont,
  stb,
  show,
}) => {
  return (
    <tr key={id} className={`${show ? "border-b border-secondary" : ""}`}>
      <td className="py-3 px-5">
        <span
          className={`py-1 px-3 rounded text-[11px] font-medium text-white ${
            keyword === "create" ? "bg-primary" : "bg-warning"
          }`}
        >
          {keyword}
        </span>
      </td>
      <td className="py-3 px-5">
        <span className="text-xs font-semibold text-secondary whitespace-nowrap">
          {keyword === "update"
            ? activity.split(" ").slice(0, -1).join(" ")
            : activity}{" "}
          {keyword === "update" && (
            <span
              className={`py-1 px-3 rounded text-[11px] font-medium text-white ${
                activity.endsWith("Active")
                  ? "bg-warning"
                  : activity.endsWith("Ready")
                  ? "bg-success"
                  : "bg-danger"
              }`}
            >
              {activity.split(" ").slice(-1)}
            </span>
          )}
        </span>
      </td>
      <td className="py-3 px-5">
        <span className="text-xs font-semibold text-secondary">
          {ont?.name ?? stb?.packageName}
        </span>
      </td>
      <td className="py-3 px-5">
        <span className="text-xs font-semibold text-secondary">
          {ont?.type ?? stb?.type}
        </span>
      </td>
      <td className="py-3 px-5">
        <span className="text-xs font-semibold text-secondary">
          {ont?.serialNumber ?? stb?.serialNumber}
        </span>
      </td>
      <td className="py-3 px-5">
        <span className="text-xs font-semibold text-secondary">
          {ont?.unitAddress ?? stb?.unitAddress}
        </span>
      </td>
      <td className="py-3 px-5">
        <span className="text-xs font-semibold text-secondary">
          {ont?.location?.location ?? stb?.location?.location}
        </span>
      </td>
    </tr>
  );
};
