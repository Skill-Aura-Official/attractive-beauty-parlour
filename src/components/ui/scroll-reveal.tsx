import { ReactNode } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  direction?: "up" | "left" | "right" | "scale";
  delay?: number;
}

export const ScrollReveal = ({ children, className, direction = "up", delay = 0 }: ScrollRevealProps) => {
  const { ref, isVisible } = useScrollReveal(0.1);

  const directionStyles = {
    up: "translate-y-12",
    left: "translate-x-12",
    right: "-translate-x-12",
    scale: "scale-95",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        isVisible ? "opacity-100 translate-x-0 translate-y-0 scale-100" : `opacity-0 ${directionStyles[direction]}`,
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};
