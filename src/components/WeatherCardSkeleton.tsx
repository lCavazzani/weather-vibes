// WeatherCardSkeleton.tsx
import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const WeatherCardSkeleton = () => {
  return (
    <div className="bg-black/40 backdrop-blur-lg rounded-lg p-6 border-2 border-purple-400 shadow-lg">
      <Skeleton circle={true} height={80} width={80} />
      <div className="mt-4 space-y-2">
        <Skeleton height={20} width="60%" />
        <Skeleton height={20} width="40%" />
      </div>
    </div>
  );
};

export default WeatherCardSkeleton;
