import React, { useState } from "react";

import { PageLayout } from "@features/admin/components/PageLayout";
import { useNavigate } from "react-router-dom";
import { UserDTO } from "@core/model/user";
import { useUserCreation } from "../hooks/useUser";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const InitialValue: UserDTO = {
  email: "",
  name: "",
  password: "",
  role: "",
};

export const UserFormAdd: React.FC = () => {
  const mutation = useUserCreation();

  const [userBody, setUserBody] = useState<UserDTO>({
    ...InitialValue,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof UserDTO, string>>>(
    {}
  );

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

    if (!userBody.password) {
      newErrors.password = "Password wajib diisi";
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
      type: "create",
      data: {
        email: userBody.email,
        password: userBody.password,
        name: userBody.name,
        role: userBody.role,
      },
    });
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
                {errors.password && (
                  <small className="text-red-500">{errors.password}</small>
                )}
              </div>
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
    </PageLayout>
  );
};
