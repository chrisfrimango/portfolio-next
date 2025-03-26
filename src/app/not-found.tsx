"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-[#ff3b00] text-4xl mb-8">Oops! Page not found</h1>
        <Link
          href="/"
          className="text-[#6f6f6f] hover:text-[#ff3b00] transition-colors duration-300"
        >
          Return to home
        </Link>
      </motion.div>
    </div>
  );
}
