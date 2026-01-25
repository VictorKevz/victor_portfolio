import type { ElementType } from "react";

interface GradientIconProps {
  Icon: ElementType;
  gradient: "gradient-primary" | "gradient-secondary";
  className?: string;
}

export function GradientIcon({
  Icon,
  gradient,
  className = "",
}: GradientIconProps) {
  return (
    <span
      className={`relative p-px rounded-lg flex items-center justify-center overflow-hidden ${className}`}
      style={{ background: `var(--${gradient})` }}
    >
      <span
        aria-hidden="true"
        className="flex items-center justify-center h-8 w-8 rounded-lg bg-(--neutral-0)/80"
      >
        <Icon className="text-on-primary body-text-dark" fontSize="medium" />
      </span>
    </span>
  );
}
