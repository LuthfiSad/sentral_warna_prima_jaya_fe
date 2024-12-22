import React, { PropsWithChildren } from "react";

interface ITableBodyProps extends PropsWithChildren {
  children: React.ReactNode;
}

export const TableBody: React.FC<ITableBodyProps> = ({ children }) => {
  return <tbody>{children}</tbody>;
};
