import { AuthRegisterDTO } from "@core/model/auth";
import React, { useState } from "react";
import { useAuthRegister } from "../hooks/useAuth";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { CustomApiError } from "@features/_global/types/CustomApiError";

const InitialValue = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const Register: React.FC = () => {
  const [authBody, setAuthBody] = useState<AuthRegisterDTO>({
    ...InitialValue,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof AuthRegisterDTO, string>>
  >({ ...InitialValue });

  const mutation = useAuthRegister();

  const validate = () => {
    const newErrors: Partial<Record<keyof AuthRegisterDTO, string>> = {};
    let isValid = true;
    
    if (!authBody.username) {
      isValid = false;
      newErrors.username = "Username wajib diisi";
    }

    if (!authBody.email) {
      isValid = false;
      newErrors.email = "Email wajib diisi";
    }
    if (!authBody.password) {
      isValid = false;
      newErrors.password = "Password wajib diisi";
    }
    if (!authBody.confirmPassword) {
      isValid = false;
      newErrors.confirmPassword = "Konfirmasi Password wajib diisi";
    }

    if (authBody.password !== authBody.confirmPassword) {
      isValid = false;
      newErrors.confirmPassword = "Konfirmasi Password tidak sesuai";
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    if (!validate()) return;
    try {
      await mutation.mutateAsync(authBody);
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
    setAuthBody(InitialValue);
    setErrors({});
  };

  return (
    <form className="form form-horizontal" onSubmit={handleSubmit}>
      <div className="form-body">
        <div className="row">
          {/* Username Field */}
          <div className="col-md-12">
            <div className="form-group">
              <label htmlFor="username-horizontal-icon" className="text-black">
                Username
              </label>
              <div className="has-icon-left form-group mt-2">
                <div className="position-relative">
                  <input
                    type="text"
                    className="form-control rounded-full bg-transparent text-black border-black py-2"
                    placeholder="johndoe"
                    id="username-horizontal-icon"
                    autoComplete="username"
                    value={authBody.username}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setAuthBody((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                  />
                  <div className="form-control-icon !top-1/2 transform -translate-y-1/2">
                    <FaUser />
                  </div>
                </div>
                {errors.username && (
                  <small className="text-danger">{errors.username}</small>
                )}
              </div>
            </div>
          </div>

          {/* Email Field */}
          <div className="col-md-12">
            <div className="form-group">
              <label htmlFor="email-horizontal-icon" className="text-black">
                Email or Username
              </label>
              <div className="has-icon-left form-group mt-2">
                <div className="position-relative">
                  <input
                    type="email"
                    className="form-control rounded-full bg-transparent text-black border-black py-2"
                    placeholder="johndoe@email.com"
                    id="email-horizontal-icon"
                    autoComplete="email"
                    value={authBody.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setAuthBody((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                  <div className="form-control-icon !top-1/2 transform -translate-y-1/2">
                    <FaEnvelope />
                  </div>
                </div>
                {errors.email && (
                  <small className="text-danger">{errors.email}</small>
                )}
              </div>
            </div>
          </div>

          {/* Password Field */}
          <div className="col-md-12">
            <div className="form-group">
              <label htmlFor="password-horizontal-icon" className="text-black">
                Password
              </label>
              <div className="has-icon-left form-group mt-2">
                <div className="position-relative">
                  <input
                    type="password"
                    className="form-control rounded-full bg-transparent text-black border-black py-2"
                    placeholder="********"
                    id="password-horizontal-icon"
                    autoComplete="current-password"
                    value={authBody.password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setAuthBody((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                  />
                  <div className="form-control-icon !top-1/2 transform -translate-y-1/2">
                    <FaLock />
                  </div>
                </div>
                {errors.password && (
                  <small className="text-danger">{errors.password}</small>
                )}
              </div>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="col-md-12">
            <div className="form-group">
              <label htmlFor="password-horizontal-icon" className="text-black">
                Confirm Password
              </label>
              <div className="has-icon-left form-group mt-2">
                <div className="position-relative">
                  <input
                    type="password"
                    className="form-control rounded-full bg-transparent text-black border-black py-2"
                    placeholder="********"
                    id="password-horizontal-icon"
                    autoComplete="current-password"
                    value={authBody.confirmPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setAuthBody((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                  />
                  <div className="form-control-icon !top-1/2 transform -translate-y-1/2">
                    <FaLock />
                  </div>
                </div>
                {errors.confirmPassword && (
                  <small className="text-danger">
                    {errors.confirmPassword}
                  </small>
                )}
              </div>
            </div>
          </div>

          {/* Submit and Reset Buttons */}
          <div className="col-12 d-flex justify-content-end">
            <button
              type="submit"
              className="btn btn-primary w-full me-1 mb-1"
              disabled={mutation.isPending}
            >
              Register
            </button>
            <button
              type="reset"
              className="btn btn-light-secondary w-full me-1 mb-1"
              disabled={mutation.isPending}
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
          <div className="col-12 text-center mt-2">
            <p className="text-black">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Login
              </Link>
            </p>
          </div>
          <div className="col-12 text-center mt-2">
            <p className="text-black">
              Want to Absen?{" "}
              <Link to="/absen" className="text-primary hover:underline">
                Absen
              </Link>
            </p>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Register;
