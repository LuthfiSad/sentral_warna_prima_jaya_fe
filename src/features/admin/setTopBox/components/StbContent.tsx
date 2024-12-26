import { PageLayout } from "@features/admin/components/PageLayout";
import LoadingData from "@features/_global/components/LoadingData";
import {
  Table,
  TableBody,
  TableHead,
} from "@features/_global/components/Table";
import { convertQueryParamsToObject } from "@features/_global/helper";
import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useStb, useStbCreation } from "../hooks/useStb";
import { TableItem } from "./Table/TableItem";
import EmptyData from "@features/_global/components/EmptyData";
import { RiFileExcel2Fill } from "react-icons/ri";
import { useExport } from "@features/_global/hooks/useExport";

export const StbContent: React.FC = () => {
  const { locationId } = useParams();
  const { data: stbs, isLoading } = useStb({ locationId });

  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = convertQueryParamsToObject(searchParams.toString());
  const onPageChange = (page: number) =>
    setSearchParams({ ...queryParams, page: page.toString() });

  const mutation = useStbCreation();
  const mutationExport = useExport();

  const handleDelete = async (id: string) => {
    await mutation.mutateAsync({
      type: "delete",
      id,
    });
  };

  const handleExport = async () => {
    await mutationExport.mutateAsync({
      type: "stb",
      locationId,
    });
  };

  const pagination = {
    currentPage: stbs?.meta?.page || 1,
    totalPages: stbs?.meta?.totalPages || 1,
    onPageChange,
  };

  const tableHead = [
    "Nomor Seri",
    "Type",
    "ID Device",
    "Nomor WO",
    "Alamat",
    "Nama Paket",
    "Tanggal Aktivasi",
    "Status",
    "Lokasi Device",
    "Location",
    "Keterangan",
    "Catatan",
    "Update",
    "Action",
  ];

  return (
    <PageLayout
      title="Set Top Box"
      action={{
        show: true,
        buttonTitle: "Create Set Top Box",
        link: { to: "/admin/stb/create" },
      }}
      headBackground="black"
      showPagination={
        !!(
          stbs?.data?.length &&
          !isLoading &&
          (stbs.meta?.totalData as number) > (stbs?.meta?.perPage as number)
        )
      }
      pagination={pagination}
      searchField
      searchPlaceholder="Search Stb"
      buttonFilter="Device Location"
      buttonFilterOptions={[
        {
          label: "Active",
          value: "Active",
          key: "deviceLocation",
        },
        {
          label: "Ready",
          value: "Ready",
          key: "deviceLocation",
        },
        {
          label: "Back",
          value: "Back",
          key: "deviceLocation",
        },
      ]}
      buttonCheckbox={{
        label: "Active",
        value: "Active",
        key: "status",
      }}
      buttonFile={[
        {
          handleFile: handleExport,
          icon: <RiFileExcel2Fill className="w-5 h-5" />,
          label: "Excel",
        },
      ]}
    >
      <Table>
        <TableHead field={tableHead} />

        <TableBody>
          {isLoading ? (
            <tr>
              <td colSpan={tableHead.length}>
                <LoadingData />
              </td>
            </tr>
          ) : !stbs?.data?.length ? (
            <tr>
              <td colSpan={tableHead.length}>
                <EmptyData title="set top box" />
              </td>
            </tr>
          ) : (
            <>
              {stbs?.data?.map((item, key) => (
                <TableItem
                  key={key}
                  {...item}
                  show={key !== (stbs?.data?.length as number) - 1}
                  handleDelete={handleDelete}
                />
              ))}
            </>
          )}
        </TableBody>
      </Table>
    </PageLayout>
  );
};
