import React from "react";
import Loading from "@core/assets/icon/loading.svg";

const LoadingData: React.FC = () => {
  return (
    <div className="flex justify-center items-center animate-spin">
      <img src={Loading} width={60} alt="no-data" />
    </div>
  );
};

export default LoadingData;
