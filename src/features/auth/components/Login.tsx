import { AuthLoginDTO } from "@core/model/auth";
import React, { useState } from "react";
import { useAuthLogin } from "../hooks/useAuth";
import { FaEnvelope, FaLock } from "react-icons/fa6";

const InitialValue = {
  email: "",
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
    if (!authBody.email || !authBody.password) {
      const newErrors: AuthLoginDTO = { ...InitialValue };

      if (!authBody.email) {
        newErrors.email = "Email is required";
      }
      if (!authBody.password) {
        newErrors.password = "Password is required";
      }
      setErrors(newErrors);
      setAuthBody(InitialValue);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    await mutation.mutateAsync(authBody);
  };

  const handleReset = () => {
    setAuthBody(InitialValue);
    setErrors({});
  };

  return (
    <form className="form form-horizontal mt-4" onSubmit={handleSubmit}>
      <div className="form-body">
        <div className="row">
          {/* Email Field */}
          <div className="col-md-4">
            <label htmlFor="email-horizontal-icon">Your Email</label>
          </div>
          <div className="col-md-8">
            <div className="form-group has-icon-left">
              <div className="position-relative">
                <input
                  type="email"
                  className="form-control"
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

          {/* Password Field */}
          <div className="col-md-4">
            <label htmlFor="password-horizontal-icon">Password</label>
          </div>
          <div className="col-md-8">
            <div className="form-group has-icon-left">
              <div className="position-relative">
                <input
                  type="password"
                  className="form-control"
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

          {/* Submit and Reset Buttons */}
          <div className="col-12 d-flex justify-content-end">
            <button
              type="submit"
              className="btn btn-primary me-1 mb-1"
              disabled={false}
            >
              Log In
            </button>
            <button
              type="reset"
              className="btn btn-light-secondary me-1 mb-1"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Login;
