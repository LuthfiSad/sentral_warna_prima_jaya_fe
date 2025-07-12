// @core/model/customer.ts
export interface CustomerModel {
  id: number;
  name: string;
  address: string;
  divisi: string;
  phone: string;
  email: string;
  plate_number: string;
  vehicle_type: string;
  vehicle_model: string;
  vehicle_year: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerCreateDTO {
  name: string;
  address: string;
  phone: string;
  email: string;
  plate_number: string;
  vehicle_type: string;
  vehicle_model: string;
  vehicle_year: string;
}

export type CustomerUpdateDTO = Partial<CustomerCreateDTO>

export interface CustomerSearchResult {
  customer: CustomerModel;
  vehicle: {
    plate_number: string;
    vehicle_type: string;
    vehicle_model: string;
    vehicle_year: string;
  };
}