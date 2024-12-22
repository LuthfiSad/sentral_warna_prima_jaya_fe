export interface LocationModel {
  id: string;
  location: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface LocationDTO {
  location?: string;
}
