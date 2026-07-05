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
        <h1 className="text-brand-accent text-4xl mb-8">Oops! Page not found</h1>
        <Link
          href="/"
          className="text-brand-gray hover:text-brand-accent transition-colors duration-300"
        >
          Return to home
        </Link>
      </motion.div>
    </div>
  );
}
