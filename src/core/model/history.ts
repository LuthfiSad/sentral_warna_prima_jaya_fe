import { OntModel } from "./ont";
import { StbModel } from "./stb";

export interface HistoryModel {
  id: string;
  keyword: string;
  activity: string;
  ont: OntModel;
  stb: StbModel;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
