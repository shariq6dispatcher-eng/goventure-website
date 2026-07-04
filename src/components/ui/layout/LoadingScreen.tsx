"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Full-screen intro splash shown briefly when the site first loads.
 * Displays the GoVenture logo mark + wordmark, then fades out to
 * reveal the actual page — similar to the upsunday.co intro.
 */
export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Lock scroll while the splash is up.
    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = "";
    }, 1600);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-4"
          >
            {/* Logo mark */}
            <motion.svg
              width="56"
              height="56"
              viewBox="0 0 56 56"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              initial={{ opacity: 0, scale: 0.7, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <circle cx="28" cy="34" r="10" fill="#D4AF37" />
              {[...Array(8)].map((_, i) => {
                const angle = (i * Math.PI) / 4;
                const x1 = 28 + Math.cos(angle) * 16;
                const y1 = 34 - Math.sin(angle) * 16 - 4;
                const x2 = 28 + Math.cos(angle) * 24;
                const y2 = 34 - Math.sin(angle) * 24 - 4;
                if (y1 > 34 || y2 > 34) return null;
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#D4AF37"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                );
              })}
              <line
                x1="4"
                y1="44"
                x2="52"
                y2="44"
                stroke="#D4AF37"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </motion.svg>

            {/* Wordmark */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl sm:text-4xl font-bold tracking-wider text-white"
            >
              <span className="text-[#D4AF37]">GO</span>VENTURE
            </motion.h1>

            {/* Loading bar */}
            <div className="w-40 h-[2px] bg-white/10 rounded-full overflow-hidden mt-2">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.3, delay: 0.15, ease: "easeInOut" }}
                style={{ transformOrigin: "left" }}
                className="h-full w-full bg-[#D4AF37]"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
