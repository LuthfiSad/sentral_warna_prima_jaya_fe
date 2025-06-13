import { AttendanceModel } from "@core/model/attendance";
import React from "react";
import { useNavigate } from "react-router-dom";

interface IAttendanceItemProps extends AttendanceModel {
  show?: boolean;
  handleDelete: (id: string) => void;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
}

export const TableItem: React.FC<IAttendanceItemProps> = ({
  id,
  date,
  employee_id,
  employee,
  checkin_time,
  checkout_time,
  show,
  handleDelete,
  isSelected,
  onSelect,
}) => {
  const nav = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    const time = new Date(timeString);
    return time.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateDuration = (checkin: string, checkout: string | null) => {
    if (!checkout) return "-";

    const checkinTime = new Date(checkin);
    const checkoutTime = new Date(checkout);
    const diffMs = checkoutTime.getTime() - checkinTime.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}j ${minutes}m`;
  };

  const getStatus = (
    checkin: string | null,
    checkout: string | null,
    attendanceDate: string
  ) => {
    if (!checkin) return { text: "Belum Check In", class: "bg-secondary" };

    const today = new Date();
    const attendanceDateTime = new Date(attendanceDate);
    const isToday = today.toDateString() === attendanceDateTime.toDateString();

    if (!checkout) {
      if (isToday) {
        return { text: "Sedang Bekerja", class: "bg-warning" };
      } else {
        return { text: "Lupa Check Out", class: "bg-danger" };
      }
    }

    return { text: "Selesai", class: "bg-success" };
  };

  const status = getStatus(checkin_time ?? null, checkout_time ?? null, date);

  return (
    <tr key={id} className={`${show ? "border-b border-secondary" : ""}`}>
      <td className="py-3">
        <input
          type="checkbox"
          className="form-check-input"
          checked={isSelected}
          onChange={(e) => onSelect(e.target.checked)}
        />
      </td>

      <td className="py-3 px-5">
        <span className="text-xs font-semibold text-secondary">
          {formatDate(date)}
        </span>
      </td>

      <td className="py-3 whitespace-nowrap px-5">
        <div className="d-flex align-items-center gap-2">
          {employee?.image_url && (
            <div className="h-8 w-8 rounded-full overflow-hidden p-0 border-0 relative">
              <img
                src={employee.image_url}
                alt="Employee"
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = "none";
                  // Opsi alternatif: tampilkan placeholder
                  // target.src = "/default-avatar.png";
                }}
              />
            </div>
          )}
          <div className="d-flex flex-column">
            <span className="text-sm font-semibold text-dark">
              {employee?.name || `ID: ${employee_id}`}
            </span>
            <span className="text-xs text-muted">
              {employee?.divisi || "Unknown"}
            </span>
          </div>
        </div>
      </td>

      <td className="py-3 px-5">
        <span className="text-xs font-semibold text-secondary">
          {checkin_time ? formatTime(checkin_time) : "-"}
        </span>
      </td>

      <td className="py-3 px-5">
        <span className="text-xs font-semibold text-secondary">
          {checkout_time ? formatTime(checkout_time) : "-"}
        </span>
      </td>

      <td className="py-3 px-5">
        <span className="text-xs font-semibold text-secondary">
          {calculateDuration(checkin_time || "", checkout_time || "")}
        </span>
      </td>

      <td className="py-3 px-5 whitespace-nowrap">
        <span
          className={`py-1 px-3 rounded text-[11px] font-medium text-white ${status.class}`}
        >
          {status.text}
        </span>
      </td>

      <td className="py-3 px-5">
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-link p-0 text-info text-xs font-semibold"
            onClick={() => nav(`/dashboard/attendance/${id}`)}
          >
            Detail
          </button>
          <button
            className="btn btn-link p-0 text-danger text-xs font-semibold"
            onClick={() => {
              const confirm = window.confirm(
                "Apakah Anda yakin ingin menghapus data attendance ini?"
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
