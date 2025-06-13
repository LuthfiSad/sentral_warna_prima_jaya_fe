// AttendanceContent.tsx
import { PageLayout } from "@features/admin/components/PageLayout";
import LoadingData from "@features/_global/components/LoadingData";
import {
  Table,
  TableBody,
  TableHead,
} from "@features/_global/components/Table";
import { convertQueryParamsToObject } from "@features/_global/helper";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAttendance, useAttendanceCreation } from "../hooks/useAttendance";
import { TableItem } from "./Table/TableItem";
import EmptyData from "@features/_global/components/EmptyData";

export const AttendanceContent: React.FC = () => {
  const { data: attendances, isLoading } = useAttendance();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = convertQueryParamsToObject(searchParams.toString());
  const onPageChange = (page: number) =>
    setSearchParams({ ...queryParams, page: page.toString() });

  const mutation = useAttendanceCreation();

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await mutation.mutateAsync({
        type: "delete",
        data: { attendance_ids: [id] },
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    
    const confirm = window.confirm(
      `Apakah Anda yakin ingin menghapus ${selectedIds.length} data attendance?`
    );
    if (!confirm) return;

    setIsDeleting(true);
    try {
      await mutation.mutateAsync({
        type: "delete",
        data: { attendance_ids: selectedIds},
      });
      setSelectedIds([]);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = attendances?.data?.map(item => item.id) || [];
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
    }
  };

  const handleCancel = () => {
    setSelectedIds([]);
  };

  const pagination = {
    currentPage: attendances?.meta?.page || 1,
    totalPages: attendances?.meta?.totalPages || 1,
    onPageChange,
  };

  const tableHead = [
    <div key="select-all" className="d-flex align-items-center">
      <input
        type="checkbox"
        className="form-check-input me-2"
        checked={selectedIds.length === attendances?.data?.length && attendances?.data?.length > 0}
        onChange={(e) => handleSelectAll(e.target.checked)}
      />
      <span>Pilih</span>
    </div>,
    "Tanggal",
    "Karyawan",
    "Check In",
    "Check Out",
    "Durasi",
    "Status",
    "Aksi",
  ];

  return (
    <>
      <PageLayout
        title="Data Attendance"
        headBackground="black"
        showPagination={
          !!(
            attendances?.data?.length &&
            !isLoading &&
            (attendances.meta?.totalData as number) >
              (attendances?.meta?.perPage as number)
          )
        }
        pagination={pagination}
        searchField
        searchPlaceholder="Cari Attendance"
      >
        {/* Bulk Action Buttons */}
        {selectedIds.length > 0 && (
          <div className="mb-3 p-3 bg-light rounded d-flex align-items-center justify-content-between">
            <span className="text-sm font-semibold">
              {selectedIds.length} item dipilih
            </span>
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={handleCancel}
                disabled={isDeleting}
              >
                Batal
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={handleBulkDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        )}

        <Table>
          <TableHead field={tableHead} />

          <TableBody>
            {isLoading ? (
              <tr>
                <td colSpan={tableHead.length}>
                  <LoadingData />
                </td>
              </tr>
            ) : !attendances?.data?.length ? (
              <tr>
                <td colSpan={tableHead.length}>
                  <EmptyData title="Attendance" />
                </td>
              </tr>
            ) : (
              <>
                {attendances?.data?.map((item, key) => (
                  <TableItem
                    key={item.id}
                    {...item}
                    show={key !== (attendances?.data?.length as number) - 1}
                    handleDelete={handleDelete}
                    isSelected={selectedIds.includes(item.id)}
                    onSelect={(checked: boolean) => handleSelectItem(item.id, checked)}
                  />
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </PageLayout>
    </>
  );
};