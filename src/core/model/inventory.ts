export interface InventoryModel {
  id: string;
  itemName: string;
  unit: string;
  quantity: number;
  damagedQuantity: number;
  goodQuantity: number;
  information: string;
  notes: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface InventoryDTO {
  itemName?: string;
  unit?: string;
  quantity?: number | string;
  damagedQuantity?: number | string;
  goodQuantity?: number | string;
  information?: string;
  notes?: string;
}
