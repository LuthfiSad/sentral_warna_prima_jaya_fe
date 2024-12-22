import React, { useState } from "react";

import { PageLayout } from "@features/admin/components/PageLayout";
import { useNavigate } from "react-router-dom";
import { OntDTO } from "@core/model/ont";
import { useOntCreation } from "../hooks/useOnt";
import { useLocation } from "@features/admin/localton/hooks/useLocation";

const InitialValue: OntDTO = {
  serialNumber: "",
  type: "",
  numberWo: "",
  locationId: "",
  unitAddress: "",
  name: "",
  dateActivation: new Date(),
  status: "",
  information: "",
};

const OntFormAdd: React.FC = () => {
  const mutation = useOntCreation();
  const { data: location, isLoading } = useLocation();

  const [ontBody, setOntBody] = useState<OntDTO>({
    ...InitialValue,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof OntDTO, string>>>(
    {}
  );

  const navigate = useNavigate();

  const validate = () => {
    const newErrors: Partial<Record<keyof OntDTO, string>> = {};
    let isValid = true;

    if (!ontBody.serialNumber) {
      newErrors.serialNumber = "Serial Number is required";
      isValid = false;
    }

    if (!ontBody.numberWo) {
      newErrors.numberWo = "Number Wo is required";
      isValid = false;
    }

    if (!ontBody.type) {
      newErrors.type = "Type is required";
      isValid = false;
    }

    if (!ontBody.locationId) {
      newErrors.locationId = "Location ID is required";
      isValid = false;
    }

    if (!ontBody.unitAddress) {
      newErrors.unitAddress = "Unit Address is required";
      isValid = false;
    }

    if (!ontBody.name) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!ontBody.dateActivation) {
      newErrors.dateActivation = "Activation Date is required";
      isValid = false;
    }

    if (!ontBody.status) {
      newErrors.status = "Status is required";
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
        serialNumber: ontBody.serialNumber,
        type: ontBody.type,
        numberWo: ontBody.numberWo,
        locationId: ontBody.locationId,
        unitAddress: ontBody.unitAddress,
        name: ontBody.name,
        dateActivation: ontBody.dateActivation,
        status: ontBody.status,
        information: ontBody.information,
      },
    });
  };

  const handleReset = () => {
    setOntBody(InitialValue);
    setErrors({});
  };

  return (
    <PageLayout
      title="Add Optical Network Terminal"
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
            {/* Serial Number Field */}
            <div className="col-md-4">
              <label htmlFor="serialNumber">Serial Number</label>
            </div>
            <div className="col-md-8 form-group">
              <input
                disabled={mutation.isPending}
                type="text"
                className="form-control"
                placeholder="Serial Number"
                id="serialNumber"
                value={ontBody.serialNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setOntBody((prev) => ({
                    ...prev,
                    serialNumber: e.target.value,
                  }))
                }
              />
              {errors.serialNumber && (
                <small className="text-danger">{errors.serialNumber}</small>
              )}
            </div>

            {/* Type Field */}
            <div className="col-md-4">
              <label htmlFor="type">Type</label>
            </div>
            <div className="col-md-8 form-group">
              <input
                disabled={mutation.isPending}
                type="text"
                className="form-control"
                placeholder="Type"
                id="type"
                value={ontBody.type}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setOntBody((prev) => ({
                    ...prev,
                    type: e.target.value,
                  }))
                }
              />
              {errors.type && (
                <small className="text-danger">{errors.type}</small>
              )}
            </div>

            {/* Number WO Field */}
            <div className="col-md-4">
              <label htmlFor="type">Number WO</label>
            </div>
            <div className="col-md-8 form-group">
              <input
                disabled={mutation.isPending}
                type="text"
                className="form-control"
                placeholder="Number WO"
                id="numberWo"
                value={ontBody.numberWo}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setOntBody((prev) => ({
                    ...prev,
                    numberWo: e.target.value,
                  }))
                }
              />
              {errors.numberWo && (
                <small className="text-danger">{errors.numberWo}</small>
              )}
            </div>

            {/* Location ID Field */}
            <div className="col-md-4">
              <label htmlFor="locationId">Location ID</label>
            </div>
            <div className="col-md-8 form-group">
              <select
                disabled={mutation.isPending || isLoading}
                className="form-control"
                id="locationId"
                value={ontBody.locationId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setOntBody((prev) => ({
                    ...prev,
                    locationId: e.target.value,
                  }))
                }
              >
                <option value="" disabled>
                  {isLoading ? "Loading locations..." : "Select Location"}
                </option>
                {location?.data?.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.location}
                  </option>
                ))}
              </select>
              {errors.locationId && (
                <small className="text-danger">{errors.locationId}</small>
              )}
            </div>

            {/* Unit Address Field */}
            <div className="col-md-4">
              <label htmlFor="unitAddress">Unit Address</label>
            </div>
            <div className="col-md-8 form-group">
              <input
                disabled={mutation.isPending}
                type="text"
                className="form-control"
                placeholder="Unit Address"
                id="unitAddress"
                value={ontBody.unitAddress}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setOntBody((prev) => ({
                    ...prev,
                    unitAddress: e.target.value,
                  }))
                }
              />
              {errors.unitAddress && (
                <small className="text-danger">{errors.unitAddress}</small>
              )}
            </div>

            {/* Name Field */}
            <div className="col-md-4">
              <label htmlFor="name">Name</label>
            </div>
            <div className="col-md-8 form-group">
              <input
                disabled={mutation.isPending}
                type="text"
                className="form-control"
                placeholder="Name"
                id="name"
                value={ontBody.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setOntBody((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
              {errors.name && (
                <small className="text-danger">{errors.name}</small>
              )}
            </div>

            {/* Date Activation Field */}
            <div className="col-md-4">
              <label htmlFor="dateActivation">Activation Date</label>
            </div>
            <div className="col-md-8 form-group">
              <input
                disabled={mutation.isPending}
                type="date"
                className="form-control"
                id="dateActivation"
                value={ontBody.dateActivation?.toISOString().split("T")[0]} // Format date
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setOntBody((prev) => ({
                    ...prev,
                    dateActivation: new Date(e.target.value),
                  }))
                }
              />
              {errors.dateActivation && (
                <small className="text-danger">{errors.dateActivation}</small>
              )}
            </div>

            {/* Status Field */}
            <div className="col-md-4">
              <label htmlFor="status">Status</label>
            </div>
            <div className="col-md-8 form-group">
              <select
                disabled={mutation.isPending}
                className="form-control"
                id="status"
                value={ontBody.status}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setOntBody((prev) => ({
                    ...prev,
                    status: e.target.value,
                  }))
                }
              >
                <option value="" disabled>
                  Select Status
                </option>
                {["Active", "Ready", "Back"].map((loc, index) => (
                  <option key={index} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              {errors.status && (
                <small className="text-danger">{errors.status}</small>
              )}
            </div>

            {/* Information Field */}
            <div className="col-md-4">
              <label htmlFor="information">Information</label>
            </div>
            <div className="col-md-8 form-group">
              <textarea
                className="form-control"
                placeholder="Information"
                id="information"
                value={ontBody.information}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setOntBody((prev) => ({
                    ...prev,
                    information: e.target.value,
                  }))
                }
              />
              {errors.information && (
                <small className="text-danger">{errors.information}</small>
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

export default OntFormAdd;
