import React from "react";

export interface ItemMenuAdmin {
  icon: React.ReactNode;
  to: string;
  name: string;
}

export type MenuAdminConfig = ItemMenuAdmin[];
