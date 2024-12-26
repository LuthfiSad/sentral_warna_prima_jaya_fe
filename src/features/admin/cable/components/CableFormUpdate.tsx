import React, { useEffect, useState } from "react";

import { PageLayout } from "@features/admin/components/PageLayout";
import { useNavigate, useParams } from "react-router-dom";
import { CableDTO } from "@core/model/cable";
import { useCableById, useCableCreation } from "../hooks/useCable";
import LoadingData from "@features/_global/components/LoadingData";

const InitialValue: CableDTO = {
  quantity: "",
  size: "",
};

export const CableFormUpdate: React.FC = () => {
  const { id } = useParams();
  const mutation = useCableCreation();

  const [cableBody, setCableBody] = useState<CableDTO>({
    ...InitialValue,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CableDTO, string>>>(
    {}
  );

  const { data: cableById, isLoading } = useCableById();
  useEffect(() => {
    if (cableById && cableById.data) {
      handleSetCableBody(cableById.data);
    }
  }, [cableById]);

  const handleSetCableBody = (data: CableDTO) => {
    const { quantity, size } = data;
    setCableBody({
      quantity,
      size,
    });
  };

  const navigate = useNavigate();

  const validate = () => {
    const newErrors: Partial<Record<keyof CableDTO, string>> = {};
    let isValid = true;

    if (!cableBody.quantity) {
      newErrors.quantity = "Quantity is required";
      isValid = false;
    }

    if (!cableBody.size) {
      newErrors.size = "Size is required";
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
        quantity: cableBody.quantity,
        size: cableBody.size,
      },
      id,
    });
  };

  const handleReset = () => {
    if (cableById && cableById.data) {
      handleSetCableBody(cableById.data);
    } else {
      setCableBody(InitialValue);
    }
    setErrors({});
  };

  return (
    <PageLayout
      title="Update Cable"
      headBackground="orange"
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
              {/* Size Field */}
              <div className="col-md-4">
                <label htmlFor="size">Size</label>
              </div>
              <div className="col-md-8 form-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Size"
                  id="size"
                  disabled={mutation.isPending}
                  value={cableBody.size}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCableBody((prev) => ({
                      ...prev,
                      size: e.target.value,
                    }))
                  }
                />
                {errors.size && (
                  <small className="text-danger">{errors.size}</small>
                )}
              </div>
              {/* Quantity Field */}
              <div className="col-md-4">
                <label htmlFor="quantity">Quantity</label>
              </div>
              <div className="col-md-8 form-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Quantity"
                  id="quantity"
                  disabled={mutation.isPending}
                  value={cableBody.quantity}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCableBody((prev) => ({
                      ...prev,
                      quantity: e.target.value,
                    }))
                  }
                />
                {errors.quantity && (
                  <small className="text-danger">{errors.quantity}</small>
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
