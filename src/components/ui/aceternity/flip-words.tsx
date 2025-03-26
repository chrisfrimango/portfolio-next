"use client";
import { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

export const FlipWords = ({
  words,
  className = "",
  duration = 2,
}: {
  words: string[];
  className?: string;
  duration?: number;
}) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref);

  useEffect(() => {
    if (isInView) {
      controls.start({
        opacity: 1,
        y: 0,
      });
    }
  }, [isInView, controls]);

  return (
    <div ref={ref} className="relative inline-block h-[1em]">
      {words.map((word, idx) => (
        <motion.span
          key={word}
          className={`absolute w-full ${className}`}
          initial={{ opacity: 0, y: 50 }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: [50, 0, 0, -50],
            transition: {
              duration: duration,
              delay: idx * duration,
              repeat: Infinity,
              repeatDelay: (words.length - 1) * duration,
              times: [0, 0.2, 0.8, 1],
            },
          }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
};
