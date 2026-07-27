import React from "react";

export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center w-full">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-brand-gray border-t-brand-accent" />
      <p className="text-brand-gray text-sm mt-4">loading sayhi page....</p>
    </div>
  );
}
