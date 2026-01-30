import type { ElementType } from "react";

interface GradientIconProps {
  Icon: ElementType;
  gradient: "gradient-primary" | "gradient-secondary";
  className?: string;
  innerClassName?: string;
}

export function GradientIcon({
  Icon,
  gradient,
  className = "",
  innerClassName = "bg-(--neutral-0)/80",
}: GradientIconProps) {
  return (
    <span
      className={`relative p-px rounded-lg flex items-center justify-center overflow-hidden ${className}`}
      style={{ background: `var(--${gradient})` }}
    >
      <span
        aria-hidden="true"
        className={`flex items-center justify-center h-8 w-8 md:h-10 md:w-10 rounded-lg ${innerClassName}`}
      >
        <Icon className="text-on-primary body-text-dark" fontSize="medium" />
      </span>
    </span>
  );
}
