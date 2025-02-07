import { PageLayout } from "@features/admin/components/PageLayout";
import LoadingData from "@features/_global/components/LoadingData";
import {
  Table,
  TableBody,
  TableHead,
} from "@features/_global/components/Table";
import { convertQueryParamsToObject } from "@features/_global/helper";
import React from "react";
import { useSearchParams } from "react-router-dom";
import { useUser, useUserCreation } from "../hooks/useUser";
import { TableItem } from "./Table/TableItem";
import EmptyData from "@features/_global/components/EmptyData";

export const UserContent: React.FC = () => {
  const { data: users, isLoading } = useUser();

  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = convertQueryParamsToObject(searchParams.toString());
  const onPageChange = (page: number) =>
    setSearchParams({ ...queryParams, page: page.toString() });

  const mutation = useUserCreation();

  const handleDelete = async (id: string) => {
    await mutation.mutateAsync({
      type: "delete",
      id,
    });
  };

  const pagination = {
    currentPage: users?.meta?.page || 1,
    totalPages: users?.meta?.totalPages || 1,
    onPageChange,
  };

  const tableHead = ["Nama", "Email", "Role", "Action"];

  return (
    <PageLayout
      title="User"
      action={{
        show: true,
        buttonTitle: "Tambah User",
        link: { to: "/user/create" },
      }}
      headBackground="black"
      showPagination={
        !!(
          users?.data?.length &&
          !isLoading &&
          (users.meta?.totalData as number) > (users?.meta?.perPage as number)
        )
      }
      pagination={pagination}
      searchField
      searchPlaceholder="Search User"
      buttonFilter="Role"
      buttonFilterOptions={[
        {
          label: "USER",
          value: "USER",
          key: "status",
        },
        {
          label: "ADMIN",
          value: "ADMIN",
          key: "status",
        },
        {
          label: "LEADER",
          value: "LEADER",
          key: "status",
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
          ) : !users?.data?.length ? (
            <tr>
              <td colSpan={tableHead.length}>
                <EmptyData title="User" />
              </td>
            </tr>
          ) : (
            <>
              {users?.data?.map((item, key) => (
                <TableItem
                  key={key}
                  {...item}
                  show={key !== (users?.data?.length as number) - 1}
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
