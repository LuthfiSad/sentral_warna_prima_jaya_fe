import React, { useState } from "react";

import { PageLayout } from "@features/admin/components/PageLayout";
import { useNavigate } from "react-router-dom";
import { useUserCreation } from "../hooks/useUser";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AuthRegisterDTO } from "@core/model/auth";
import { CustomApiError } from "@features/_global/types/CustomApiError";

const InitialValue: AuthRegisterDTO = {
  username: "",
  email: "",
  password: "",
  is_admin: false,
};

export const UserFormAdd: React.FC = () => {
  const mutation = useUserCreation();

  const [userBody, setUserBody] = useState<AuthRegisterDTO>({
    ...InitialValue,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof AuthRegisterDTO, string>>
  >({});

  const navigate = useNavigate();

  const validate = () => {
    const newErrors: Partial<Record<keyof AuthRegisterDTO, string>> = {};
    let isValid = true;

    if (!userBody.username) {
      newErrors.username = "Username wajib diisi";
      isValid = false;
    }

    if (!userBody.email && !userBody.is_admin) {
      newErrors.email = "Email wajib diisi";
      isValid = false;
    }

    if (!userBody.password) {
      newErrors.password = "Password wajib diisi";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await mutation.mutateAsync({
        type: "create",
        data: {
          username: userBody.username,
          email: userBody.email,
          password: userBody.password,
          is_admin: userBody.is_admin,
        },
      });
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        (error as CustomApiError).error !== undefined
      ) {
        const customError = error as CustomApiError;
        setErrors({ ...customError.error });
      }
    }
  };

  const handleReset = () => {
    setUserBody(InitialValue);
    setErrors({});
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <PageLayout
      title="Tambah User"
      headBackground="blue"
      action={{
        show: true,
        buttonTitle: "Cancel",
        buttonProps: { onClick: () => navigate(-1) },
        colorButton: "red",
      }}
    >
      <form className="form form-horizontal mt-4" onSubmit={handleSubmit}>
        <div className="form-body">
          <div className="row">
            {/* Username Field */}
            <div className="col-md-4">
              <label htmlFor="username">Username</label>
            </div>
            <div className="col-md-8 form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Username"
                id="username"
                value={userBody.username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setUserBody((prev) => ({
                    ...prev,
                    username: e.target.value,
                  }))
                }
                disabled={mutation.isPending}
              />
              {errors.username && (
                <small className="text-danger">{errors.username}</small>
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

            {/* Password Field */}
            <div className="col-md-4">
              <label htmlFor="password">Password</label>
            </div>
            <div className="col-md-8 form-group">
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Password"
                  id="password"
                  value={userBody.password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setUserBody((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  disabled={mutation.isPending}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5" />
                  ) : (
                    <FaEye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <small className="text-danger">{errors.password}</small>
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
                value={userBody.is_admin ? "true" : "false"}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setUserBody((prev) => ({
                    ...prev,
                    is_admin: e.target.value === "true",
                  }))
                }
                disabled={mutation.isPending}
              >
                <option value="false">KARYAWAN</option>
                <option value="true">PERSONALIA</option>
              </select>
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
    </PageLayout>
  );
};
