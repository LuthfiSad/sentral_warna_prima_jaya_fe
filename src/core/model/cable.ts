import { LocationModel } from "./location";

export interface CableModel {
  id: string;
  type: string;
  quantity: number;
  size: string;
  locationId: string;
  location: LocationModel;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface CableDTO {
  type?: string;
  quantity?: number | string;
  size?: string;
  locationId?: string;
}
