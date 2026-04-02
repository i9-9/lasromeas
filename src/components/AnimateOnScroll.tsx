"use client";

import { useFadeUp } from "@/components/useScrollAnimation";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

export default function AnimateOnScroll({ children, className = "" }: Props) {
  const ref = useFadeUp();
  return (
    <div ref={ref} className={`fade-up ${className}`}>
      {children}
    </div>
  );
}
