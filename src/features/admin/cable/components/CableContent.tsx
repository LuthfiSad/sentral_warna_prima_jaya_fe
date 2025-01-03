import { PageLayout } from "@features/admin/components/PageLayout";
import LoadingData from "@features/_global/components/LoadingData";
import {
  Table,
  TableBody,
  TableHead,
} from "@features/_global/components/Table";
import React from "react";
import { useCable } from "../hooks/useCable";
import { TableItem } from "./Table/TableItem";
import EmptyData from "@features/_global/components/EmptyData";
import { useParams } from "react-router-dom";

export const CableContent: React.FC = () => {
  const { locationId } = useParams();
  const { data: adaptor, isLoading: isLoadingAdaptor } = useCable({
    type: "Adaptor",
    locationId,
  });
  const { data: patchcord, isLoading: isLoadingPatchcord } = useCable({
    type: "Patchcord",
    locationId,
  });

  const tableHead = ["Ukuran", "Jumlah", "Lokasi", "Action"];

  return (
    <>
      <PageLayout title="Kabel Adaptor" headBackground="blue">
        <Table>
          <TableHead field={tableHead} />

          <TableBody>
            {isLoadingAdaptor ? (
              <tr>
                <td colSpan={tableHead.length}>
                  <LoadingData />
                </td>
              </tr>
            ) : !adaptor?.data?.length ? (
              <tr>
                <td colSpan={tableHead.length}>
                  <EmptyData title="Kabel" />
                </td>
              </tr>
            ) : (
              <>
                {adaptor?.data?.map((item, key) => (
                  <TableItem
                    key={key}
                    {...item}
                    show={key !== (adaptor?.data?.length as number) - 1}
                  />
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </PageLayout>
      <PageLayout title="Kabel Patchcord" headBackground="green">
        <Table>
          <TableHead field={tableHead} />

          <TableBody>
            {isLoadingPatchcord ? (
              <tr>
                <td colSpan={tableHead.length}>
                  <LoadingData />
                </td>
              </tr>
            ) : !patchcord?.data?.length ? (
              <tr>
                <td colSpan={tableHead.length}>
                  <EmptyData title="Kabel" />
                </td>
              </tr>
            ) : (
              <>
                {patchcord?.data?.map((item, key) => (
                  <TableItem
                    key={key}
                    {...item}
                    show={key !== (patchcord?.data?.length as number) - 1}
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
