// WeatherCardSkeleton.tsx
import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const WeatherCardSkeleton = () => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md flex flex-col items-center">
      {/* Circle placeholder for weather icon */}
      <Skeleton circle={true} height={80} width={80} />

      {/* Placeholder for the temperature and description */}
      <div className="mt-4 w-full space-y-2">
        <Skeleton height={20} width="60%" />
        <Skeleton height={20} width="40%" />
      </div>
    </div>
  );
};

export default WeatherCardSkeleton;
