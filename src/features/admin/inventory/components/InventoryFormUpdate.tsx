import React, { useEffect, useState } from "react";

import { PageLayout } from "@features/admin/components/PageLayout";
import { useNavigate, useParams } from "react-router-dom";
import { InventoryDTO } from "@core/model/inventory";
import { useInventoryById, useInventoryCreation } from "../hooks/useInventory";
import LoadingData from "@features/_global/components/LoadingData";

const InitialValue: InventoryDTO = {
  itemName: "",
  unit: "",
  quantity: "",
  damagedQuantity: "",
  goodQuantity: "",
  information: "",
  notes: "",
};

export const InventoryFormUpdate: React.FC = () => {
  const { id } = useParams();
  const mutation = useInventoryCreation();

  const [inventoryBody, setInventoryBody] = useState<InventoryDTO>({
    ...InitialValue,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof InventoryDTO, string>>
  >({});

  const { data: inventoryById, isLoading } = useInventoryById();
  useEffect(() => {
    if (inventoryById && inventoryById.data) {
      handleSetInventoryBody(inventoryById.data);
    }
  }, [inventoryById]);

  const handleSetInventoryBody = (data: InventoryDTO) => {
    const {
      itemName,
      unit,
      quantity,
      goodQuantity,
      damagedQuantity,
      information,
      notes,
    } = data;
    setInventoryBody({
      itemName,
      unit,
      quantity,
      goodQuantity,
      damagedQuantity,
      information,
      notes,
    });
  };

  const navigate = useNavigate();

  const validate = () => {
    const newErrors: Partial<Record<keyof InventoryDTO, string>> = {};
    let isValid = true;

    if (!inventoryBody.itemName) {
      newErrors.itemName = "Item Name is required";
      isValid = false;
    }

    if (!inventoryBody.unit) {
      newErrors.unit = "Unit is required";
      isValid = false;
    }

    if (!inventoryBody.quantity) {
      newErrors.quantity = "Quantity is required";
      isValid = false;
    }

    if (!inventoryBody.damagedQuantity) {
      newErrors.damagedQuantity = "Damaged Quantity is required";
      isValid = false;
    }

    if (!inventoryBody.goodQuantity) {
      newErrors.goodQuantity = "Good Quantity is required";
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
        itemName: inventoryBody.itemName,
        unit: inventoryBody.unit,
        quantity: inventoryBody.quantity,
        damagedQuantity: inventoryBody.damagedQuantity,
        goodQuantity: inventoryBody.goodQuantity,
        information: inventoryBody.information,
        notes: inventoryBody.notes,
      },
      id,
    });
  };

  const handleReset = () => {
    if (inventoryById && inventoryById.data) {
      handleSetInventoryBody(inventoryById.data);
    } else {
      setInventoryBody(InitialValue);
    }
    setErrors({});
  };

  return (
    <PageLayout
      title="Update Inventaris"
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
              {/* Item Name Field */}
              <div className="col-md-4">
                <label htmlFor="itemName">Item Name</label>
              </div>
              <div className="col-md-8 form-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Item Name"
                  disabled={mutation.isPending}
                  id="itemName"
                  value={inventoryBody.itemName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setInventoryBody((prev) => ({
                      ...prev,
                      itemName: e.target.value,
                    }))
                  }
                />
                {errors.itemName && (
                  <small className="text-danger">{errors.itemName}</small>
                )}
              </div>

              {/* Unit Field */}
              <div className="col-md-4">
                <label htmlFor="unit">Unit</label>
              </div>
              <div className="col-md-8 form-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Unit"
                  disabled={mutation.isPending}
                  id="unit"
                  value={inventoryBody.unit}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setInventoryBody((prev) => ({
                      ...prev,
                      unit: e.target.value,
                    }))
                  }
                />
                {errors.unit && (
                  <small className="text-danger">{errors.unit}</small>
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
                  disabled={mutation.isPending}
                  id="quantity"
                  value={inventoryBody.quantity}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setInventoryBody((prev) => ({
                      ...prev,
                      quantity: e.target.value,
                    }))
                  }
                />
                {errors.quantity && (
                  <small className="text-danger">{errors.quantity}</small>
                )}
              </div>

              {/* Damaged Quantity Field */}
              <div className="col-md-4">
                <label htmlFor="damagedQuantity">Damaged Quantity</label>
              </div>
              <div className="col-md-8 form-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Damaged Quantity"
                  disabled={mutation.isPending}
                  id="damagedQuantity"
                  value={inventoryBody.damagedQuantity}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setInventoryBody((prev) => ({
                      ...prev,
                      damagedQuantity: e.target.value,
                    }))
                  }
                />
                {errors.damagedQuantity && (
                  <small className="text-danger">
                    {errors.damagedQuantity}
                  </small>
                )}
              </div>

              {/* Good Quantity Field */}
              <div className="col-md-4">
                <label htmlFor="goodQuantity">Good Quantity</label>
              </div>
              <div className="col-md-8 form-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Good Quantity"
                  disabled={mutation.isPending}
                  id="goodQuantity"
                  value={inventoryBody.goodQuantity}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setInventoryBody((prev) => ({
                      ...prev,
                      goodQuantity: e.target.value,
                    }))
                  }
                />
                {errors.goodQuantity && (
                  <small className="text-danger">{errors.goodQuantity}</small>
                )}
              </div>

              {/* Information Field */}
              <div className="col-md-4">
                <label htmlFor="information">Information</label>
              </div>
              <div className="col-md-8 form-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Information"
                  disabled={mutation.isPending}
                  id="information"
                  value={inventoryBody.information}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setInventoryBody((prev) => ({
                      ...prev,
                      information: e.target.value,
                    }))
                  }
                />
                {errors.information && (
                  <small className="text-danger">{errors.information}</small>
                )}
              </div>

              {/* Notes Field */}
              <div className="col-md-4">
                <label htmlFor="notes">Notes</label>
              </div>
              <div className="col-md-8 form-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Notes"
                  disabled={mutation.isPending}
                  id="notes"
                  value={inventoryBody.notes}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setInventoryBody((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                />
                {errors.notes && (
                  <small className="text-danger">{errors.notes}</small>
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
