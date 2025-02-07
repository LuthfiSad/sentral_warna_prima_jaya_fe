import React, { useState } from "react";

import { PageLayout } from "@features/admin/components/PageLayout";
import { useNavigate, useParams } from "react-router-dom";
import { ChangePasswordDTO } from "@core/model/user";
import { useUserCreation } from "../hooks/useUser";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const InitialValue: ChangePasswordDTO = {
  newPassword: "",
  password: "",
};

export const UserFormUpdatePassword: React.FC = () => {
  const { id } = useParams();
  const mutation = useUserCreation();

  const [userBody, setUserBody] = useState<ChangePasswordDTO>({
    ...InitialValue,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ChangePasswordDTO, string>>
  >({});

  const navigate = useNavigate();

  const validate = () => {
    const newErrors: Partial<Record<keyof ChangePasswordDTO, string>> = {};
    let isValid = true;

    if (!userBody.password) {
      newErrors.password = "Password Lama wajib diisi";
      isValid = false;
    }

    if (!userBody.newPassword) {
      newErrors.newPassword = "Password Baru wajib diisi";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    await mutation.mutateAsync({
      type: "change",
      data: {
        password: userBody.password,
        newPassword: userBody.newPassword,
      },
      id,
    });
  };

  const handleReset = () => {
    setUserBody(InitialValue);
    setErrors({});
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

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
      <form className="form form-horizontal mt-4" onSubmit={handleSubmit}>
        <div className="form-body">
          <div className="row">
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

            {/* Password Field */}
            <div className="col-md-4">
              <label htmlFor="password">New Password</label>
            </div>
            <div className="col-md-8 form-group">
              <div className="relative w-full">
                <input
                  type={showNewPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="New Password"
                  id="password"
                  value={userBody.newPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setUserBody((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }))
                  }
                  disabled={mutation.isPending}
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <FaEyeSlash className="h-5 w-5" />
                  ) : (
                    <FaEye className="h-5 w-5" />
                  )}
                </button>
                {errors.newPassword && (
                  <small className="text-red-500">{errors.newPassword}</small>
                )}
              </div>
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
