"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";

export default function TiltCard({
  children,
  className = "",
  variants,
  tilt = 8,
  lift = true,
}: {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  /** Max rotation in degrees. */
  tilt?: number;
  /** Whether the card also lifts (-y) and glows on hover. */
  lift?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [tilt, -tilt]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-tilt, tilt]), {
    stiffness: 200,
    damping: 20,
  });

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    // Only respond to an actual mouse — touch drags are scroll gestures,
    // not hover intent, and reacting to them fights with mobile scrolling.
    if (e.pointerType !== "mouse") return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handlePointerLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <motion.div
      ref={ref}
      variants={variants}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      whileHover={lift ? { y: -8 } : undefined}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={className}
    >
      <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </motion.div>
  );
}
