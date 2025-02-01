import React from "react";

export const LoadingScreen = () => (
  <div className="min-h-screen bg-white flex flex-col items-center justify-center">
    <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4" />
    <p className="text-purple-600 text-lg font-semibold">Loading amazing shoes...</p>
  </div>
);