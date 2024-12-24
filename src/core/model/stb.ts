export interface StbModel {
  id: string;
  serialNumber: string;
  type: string;
  deviceId: string; //new
  numberWo: string;
  locationId: string;
  unitAddress: string;
  packageName: string; //change name
  dateActivation: Date;
  status: string; // tobe active
  deviceLocation: string; //new and ont status
  information: string;
  notes: string; //new
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface StbDTO {
  serialNumber?: string;
  type?: string;
  deviceId?: string;
  numberWo?: string;
  locationId?: string;
  unitAddress?: string;
  packageName?: string;
  dateActivation?: Date;
  status?: string;
  deviceLocation?: string;
  information?: string;
  notes?: string;
}
