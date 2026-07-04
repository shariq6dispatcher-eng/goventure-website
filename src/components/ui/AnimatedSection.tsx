"use client";

import { motion } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";

export default function AnimatedSection({
  children,
  direction = "up",
  delay = 0,
}: {
  children: React.ReactNode;
  /** Direction the section rises/slides in from. */
  direction?: "up" | "left" | "right" | "scale";
  delay?: number;
}) {
  const initial =
    direction === "left"
      ? { opacity: 0, x: -50 }
      : direction === "right"
      ? { opacity: 0, x: 50 }
      : direction === "scale"
      ? { opacity: 0, scale: 0.94, y: 30 }
      : { opacity: 0, y: 60 };

  return (
    <motion.div
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}
