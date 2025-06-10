import React, { useState } from "react";
import { ChangePasswordDTO } from "@core/model/user";
import { FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";
import { CustomApiError } from "@features/_global/types/CustomApiError";

const InitialValue: ChangePasswordDTO = {
  confirm_password: "",
  password: "",
};

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onSubmit: (
    data: { password: string; confirm_password: string },
    id: string
  ) => Promise<void>;
  isLoading?: boolean;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  isOpen,
  onClose,
  userId,
  onSubmit,
  isLoading = false,
}) => {
  const [userBody, setUserBody] = useState<ChangePasswordDTO>({
    ...InitialValue,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ChangePasswordDTO, string>>
  >({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validate = () => {
    const newErrors: Partial<Record<keyof ChangePasswordDTO, string>> = {};
    let isValid = true;

    if (!userBody.password) {
      newErrors.password = "Password Baru wajib diisi";
      isValid = false;
    }

    if (!userBody.confirm_password) {
      newErrors.confirm_password = "Konfirmasi Password wajib diisi";
      isValid = false;
    }

    if (
      userBody.password &&
      userBody.confirm_password &&
      userBody.password !== userBody.confirm_password
    ) {
      newErrors.confirm_password =
        "Password dan Konfirmasi Password tidak cocok";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await onSubmit(
        {
          password: userBody.password ?? "",
          confirm_password: userBody.confirm_password ?? "",
        },
        userId
      );
      handleClose();
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

  const handleClose = () => {
    handleReset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Reset Password User</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
              disabled={isLoading}
            />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row">
                {/* Password Field */}
                <div className="col-12 mb-3">
                  <label htmlFor="password" className="form-label">
                    Password Baru
                  </label>
                  <div className="position-relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      placeholder="Masukkan password baru"
                      id="password"
                      value={userBody.password}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setUserBody((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary position-absolute end-0 top-0 h-100 px-3"
                      style={{ border: "none", backgroundColor: "transparent" }}
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.password && (
                    <small className="text-danger">{errors.password}</small>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="col-12 mb-3">
                  <label htmlFor="confirm_password" className="form-label">
                    Konfirmasi Password
                  </label>
                  <div className="position-relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="form-control"
                      placeholder="Konfirmasi password baru"
                      id="confirm_password"
                      value={userBody.confirm_password}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setUserBody((prev) => ({
                          ...prev,
                          confirm_password: e.target.value,
                        }))
                      }
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary position-absolute end-0 top-0 h-100 px-3"
                      style={{ border: "none", backgroundColor: "transparent" }}
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.confirm_password && (
                    <small className="text-danger">
                      {errors.confirm_password}
                    </small>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleReset}
                disabled={isLoading}
              >
                Reset
              </button>
              <button
                type="button"
                className="btn btn-light"
                onClick={handleClose}
                disabled={isLoading}
              >
                Batal
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
