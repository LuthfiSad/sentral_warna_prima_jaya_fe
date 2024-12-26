import LoadingData from "@features/_global/components/LoadingData";
import React from "react";

interface StatsCardProps {
  icon: React.ReactNode;
  colorClass: string;
  title: string;
  value: string;
  isLoading: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  icon,
  colorClass,
  title,
  value,
  isLoading,
}) => {
  return (
    <div className="col-6 col-lg-4 col-md-6">
      <div className="card">
        <div className="card-body py-4-5">
          <div className="row">
            {isLoading ? (
              <LoadingData />
            ) : (
              <>
                <div className="col-md-4 col-lg-12 col-xl-12 col-xxl-5 d-flex justify-content-start">
                  <div className={`stats-icon ${colorClass} mb-2`}>{icon}</div>
                </div>
                <div className="col-md-8 col-lg-12 col-xl-12 col-xxl-7">
                  <h6 className="text-muted font-semibold">{title}</h6>
                  <h6 className="font-extrabold mb-0">{value}</h6>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
