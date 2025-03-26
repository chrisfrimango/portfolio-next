import React from "react";

export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center w-full">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#6f6f6f] border-t-[#ff3b00]" />
      <p className="text-[#6f6f6f] text-sm mt-4">loading test page....</p>
    </div>
  );
}
