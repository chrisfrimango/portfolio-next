"use client";
import React from "react";
import Link from "next/link";

export default function Error() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
      <Link href="/" className="text-[#ff3b00]">
        Go Home
      </Link>
    </div>
  );
}
