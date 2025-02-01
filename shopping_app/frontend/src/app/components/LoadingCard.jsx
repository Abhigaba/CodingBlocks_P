import React from "react";

export const LoadingCard = () => (
  <div className="bg-white rounded-lg overflow-hidden shadow-lg">
    <div className="h-64 bg-purple-100 animate-pulse" />
    <div className="p-6">
      <div className="h-4 bg-purple-100 rounded w-1/4 mb-2 animate-pulse" />
      <div className="h-6 bg-purple-100 rounded w-3/4 mb-4 animate-pulse" />
      <div className="h-8 bg-purple-100 rounded w-1/3 animate-pulse" />
    </div>
  </div>
);
