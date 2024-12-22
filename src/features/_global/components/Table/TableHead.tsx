import React from "react";

interface ITableHeadProps {
  field: string[];
}

export const TableHead: React.FC<ITableHeadProps> = ({ field }) => {
  return (
    <thead>
      <tr>
        {field.map((item, index) => (
          <th
            key={index}
            className="border-b border-blue-gray-50 py-3 px-5 text-left"
          >
            <p className="text-[11px] font-bold uppercase text-blue-gray-400">
              {item}
            </p>
          </th>
        ))}
      </tr>
    </thead>
  );
};
