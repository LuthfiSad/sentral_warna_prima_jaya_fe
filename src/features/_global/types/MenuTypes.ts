import React from "react";

export interface ItemMenuAdmin {
  icon: React.ReactNode;
  to: string;
  name: string;
  role: string[];
}

export type MenuAdminConfig = ItemMenuAdmin[];
