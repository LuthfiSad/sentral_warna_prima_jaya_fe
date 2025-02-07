import React, { useEffect, useState } from "react";

import { PageLayout } from "@features/admin/components/PageLayout";
import { useNavigate, useParams } from "react-router-dom";
import { UserDTO } from "@core/model/user";
import { useUserById, useUserCreation } from "../hooks/useUser";
import LoadingData from "@features/_global/components/LoadingData";

const InitialValue: UserDTO = {
  email: "",
  name: "",
  role: "",
};

export const UserFormUpdate: React.FC = () => {
  const { id } = useParams();
  const mutation = useUserCreation();

  const [userBody, setUserBody] = useState<UserDTO>({
    ...InitialValue,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof UserDTO, string>>>(
    {}
  );

  const { data: userById, isLoading } = useUserById();
  useEffect(() => {
    if (userById && userById.data) {
      handleSetUserBody(userById.data);
    }
  }, [userById]);

  const handleSetUserBody = (data: UserDTO) => {
    const { email, name, role } = data;
    setUserBody({
      email,
      name,
      role,
    });
  };

  const navigate = useNavigate();

  const validate = () => {
    const newErrors: Partial<Record<keyof UserDTO, string>> = {};
    let isValid = true;

    if (!userBody.name) {
      newErrors.name = "Nama wajib diisi";
      isValid = false;
    }

    if (!userBody.email) {
      newErrors.email = "Email wajib diisi";
      isValid = false;
    }

    if (!userBody.role) {
      newErrors.role = "Role wajib diisi";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    await mutation.mutateAsync({
      type: "update",
      data: {
        email: userBody.email,
        name: userBody.name,
        role: userBody.role,
      },
      id,
    });
  };

  const handleReset = () => {
    if (userById && userById.data) {
      handleSetUserBody(userById.data);
    } else {
      setUserBody(InitialValue);
    }
    setErrors({});
  };

  return (
    <PageLayout
      title="Ubah User"
      headBackground="blue"
      action={{
        show: true,
        buttonTitle: "Cancel",
        buttonProps: { onClick: () => navigate(-1) },
        colorButton: "red",
      }}
    >
      {isLoading && <LoadingData />}
      {!isLoading && (
        <form className="form form-horizontal mt-4" onSubmit={handleSubmit}>
          <div className="form-body">
            <div className="row">
              {/* Name Field */}
              <div className="col-md-4">
                <label htmlFor="name">Nama</label>
              </div>
              <div className="col-md-8 form-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nama"
                  id="name"
                  value={userBody.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setUserBody((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  disabled={mutation.isPending}
                />
                {errors.name && (
                  <small className="text-danger">{errors.name}</small>
                )}
              </div>

              {/* Email Field */}
              <div className="col-md-4">
                <label htmlFor="email">Email</label>
              </div>
              <div className="col-md-8 form-group">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  id="email"
                  value={userBody.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setUserBody((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  disabled={mutation.isPending}
                />
                {errors.email && (
                  <small className="text-danger">{errors.email}</small>
                )}
              </div>

              {/* Role Field */}
              <div className="col-md-4">
                <label htmlFor="role">Role</label>
              </div>
              <div className="col-md-8 form-group">
                <select
                  className="form-control"
                  id="role"
                  value={userBody.role}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setUserBody((prev) => ({
                      ...prev,
                      role: e.target.value,
                    }))
                  }
                  disabled={mutation.isPending}
                >
                  <option value="" disabled>
                    Pilih Role
                  </option>
                  {["ADMIN", "USER", "LEADER"].map((role, index) => (
                    <option key={index} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <small className="text-danger">{errors.role}</small>
                )}
              </div>

              {/* Submit and Reset Buttons */}
              <div className="col-12 d-flex justify-content-end">
                <button
                  type="submit"
                  className="btn btn-primary me-1 mb-1"
                  disabled={mutation.isPending}
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="btn btn-light-secondary me-1 mb-1"
                  disabled={mutation.isPending}
                  onClick={handleReset}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </PageLayout>
  );
};
