import React, { useEffect, useState } from "react";

import { PageLayout } from "@features/admin/components/PageLayout";
import { useNavigate, useParams } from "react-router-dom";
import { LocationDTO } from "@core/model/location";
import { useLocationById, useLocationCreation } from "../hooks/useLocation";
import LoadingData from "@features/_global/components/LoadingData";

const InitialValue: LocationDTO = {
  location: "",
};

const LocationFormAdd: React.FC = () => {
  const { id } = useParams();
  const mutation = useLocationCreation();

  const [locationBody, setLocationBody] = useState<LocationDTO>({
    ...InitialValue,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof LocationDTO, string>>
  >({});

  const { data: locationById, isLoading } = useLocationById();
  useEffect(() => {
    if (locationById && locationById.data) {
      const { location } = locationById.data;
      // const categoryId = category ? category.id : "";
      setLocationBody({
        location,
      });
    }
  }, [locationById]);

  const navigate = useNavigate();

  const validate = () => {
    const newErrors: Partial<Record<keyof LocationDTO, string>> = {};
    let isValid = true;

    if (!locationBody.location) {
      newErrors.location = "Location is required";
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
        location: locationBody.location,
      },
      id,
    });
  };

  const handleReset = () => {
    setLocationBody(InitialValue);
    setErrors({});
  };

  return (
    <PageLayout
      title="Add Location"
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
              {/* Location Field */}
              <div className="col-md-4">
                <label htmlFor="location">Location</label>
              </div>
              <div className="col-md-8 form-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Location"
                  id="location"
                  disabled={mutation.isPending}
                  value={locationBody.location}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setLocationBody((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                />
                {errors.location && (
                  <small className="text-danger">{errors.location}</small>
                )}
              </div>

              {/* Submit and Reset Buttons */}
              <div className="col-12 d-flex justify-content-end">
                <button type="submit" className="btn btn-primary me-1 mb-1" disabled={mutation.isPending}>
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

export default LocationFormAdd;
