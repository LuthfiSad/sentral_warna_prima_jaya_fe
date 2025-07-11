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
import { useUser, useUserCreation } from "../hooks/useUser";
import { TableItem } from "./Table/TableItem";
import EmptyData from "@features/_global/components/EmptyData";
import { ResetPasswordModal } from "./ResetPasswordModal";

export const UserContent: React.FC = () => {
  const { data: users, isLoading } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");

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

  const handleResetPassword = (userId: string) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUserId("");
  };

  const handlePasswordSubmit = async (
    data: { password: string; confirm_password: string }, 
    id: string
  ) => {
    await mutation.mutateAsync({
      type: "change",
      data: {
        password: data.password,
        confirm_password: data.confirm_password,
      },
      id,
    });
  };

  const pagination = {
    currentPage: users?.meta?.page || 1,
    totalPages: users?.meta?.totalPages || 1,
    onPageChange,
  };

  const tableHead = ["Username", "Email", "Password", "Role", "Action"];

  return (
    <>
      <PageLayout
        title="User"
        action={{
          show: true,
          buttonTitle: "Tambah User",
          link: { to: "/dashboard/user/create" },
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
        // buttonFilter="Role"
        // buttonFilterOptions={[
        //   {
        //     label: "KARYAWAN",
        //     value: "KARYAWAN",
        //     key: "status",
        //   },
        //   {
        //     label: "PERSONALIA",
        //     value: "PERSONALIA",
        //     key: "status",
        //   },
        // ]}
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
                    handleResetPassword={() => handleResetPassword(item.id)}
                  />
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </PageLayout>

      <ResetPasswordModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        userId={selectedUserId}
        onSubmit={handlePasswordSubmit}
        isLoading={mutation.isPending}
      />
    </>
  );
};