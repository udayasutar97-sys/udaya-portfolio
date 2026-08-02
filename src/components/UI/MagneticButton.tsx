"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  type HTMLMotionProps,
} from "motion/react";
import { MouseEvent, ReactNode } from "react";

type MagneticButtonProps = {
  children: ReactNode;
  strength?: number;
} & HTMLMotionProps<"a">;

export default function MagneticButton({
  children,
  strength = 0.28,
  onMouseMove,
  onMouseLeave,
  ...props
}: MagneticButtonProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, {
    stiffness: 180,
    damping: 18,
    mass: 0.45,
  });

  const springY = useSpring(y, {
    stiffness: 180,
    damping: 18,
    mass: 0.45,
  });

  const handleMouseMove = (event: MouseEvent<HTMLAnchorElement>) => {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();

    const offsetX = event.clientX - rect.left - rect.width / 2;
    const offsetY = event.clientY - rect.top - rect.height / 2;

    x.set(offsetX * strength);
    y.set(offsetY * strength);

    onMouseMove?.(event);
  };

  const handleMouseLeave = (event: MouseEvent<HTMLAnchorElement>) => {
    x.set(0);
    y.set(0);

    onMouseLeave?.(event);
  };

  return (
    <motion.a
      {...props}
      style={{
        ...props.style,
        x: springX,
        y: springY,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.span
        className="magnetic-button-content"
        style={{
          x: springX,
          y: springY,
        }}
      >
        {children}
      </motion.span>
    </motion.a>
  );
}