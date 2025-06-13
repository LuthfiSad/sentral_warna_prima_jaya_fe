import { AuthLoginDTO } from "@core/model/auth";
import React, { useState } from "react";
import { useAuthLogin } from "../hooks/useAuth";
import { FaEnvelope, FaLock } from "react-icons/fa6";
import { PiWarningCircleBold } from "react-icons/pi";
import { Link } from "react-router-dom";
import { CustomApiError } from "@features/_global/types/CustomApiError";

const InitialValue = {
  login: "",
  password: "",
};

const Login: React.FC = () => {
  const [authBody, setAuthBody] = useState<AuthLoginDTO>({
    ...InitialValue,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof AuthLoginDTO, string>>
  >({ ...InitialValue });

  const mutation = useAuthLogin();

  const validate = () => {
    const newErrors: Partial<Record<keyof AuthLoginDTO, string>> = {};
    let isValid = true;

    if (!authBody.login) {
      isValid = false;
      newErrors.login = "Email or Username wajib diisi";
    }
    if (!authBody.password) {
      isValid = false;
      newErrors.password = "Password wajib diisi";
    }
    setErrors(newErrors);
    setAuthBody(InitialValue);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
          {/* Email Field */}
          <div className="col-md-12">
            <div className="form-group">
              <label htmlFor="email-horizontal-icon" className="text-black">
                Email or Username
              </label>
              <div className="has-icon-left form-group mt-2">
                <div className="position-relative">
                  <input
                    type="text"
                    className="form-control rounded-full bg-transparent text-black border-black py-2"
                    placeholder="johndoe@email.com"
                    id="email-horizontal-icon"
                    autoComplete="email"
                    value={authBody.login}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setAuthBody((prev) => ({
                        ...prev,
                        login: e.target.value,
                      }))
                    }
                  />
                  <div className="form-control-icon !top-1/2 transform -translate-y-1/2">
                    <FaEnvelope />
                  </div>
                </div>
                {errors.login && (
                  <small className="text-danger">{errors.login}</small>
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

          {/* Submit and Reset Buttons */}
          <div className="col-12 d-flex justify-content-end">
            <button
              type="submit"
              className="btn btn-primary w-full me-1 mb-1"
              disabled={mutation.isPending}
            >
              Login
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
          <p className="text-yellow-800 items-center flex gap-1 text-xs mt-1">
            <PiWarningCircleBold />
            jika lupa akun silahkan hubungi admin
          </p>
          <div className="col-12 text-center mt-2">
            <p className="text-black">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Register
              </Link>
            </p>
          </div>
          <div className="col-12 text-center mt-2">
            <p className="text-black">
              Want to Absen?{" "}
              <Link to="/attendance" className="text-primary hover:underline">
                Absen
              </Link>
            </p>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Login;
