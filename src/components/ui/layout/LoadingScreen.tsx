"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

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
            <motion.div
              initial={{ opacity: 0, scale: 0.7, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src="/images/logo.png"
                alt="GoVenture Embroidery & Manufacturing logo"
                width={64}
                height={64}
              />
            </motion.div>

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
