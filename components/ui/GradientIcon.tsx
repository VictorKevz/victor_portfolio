import type { ElementType } from "react";

type GradientIconProps = {
  gradient: "gradient-primary" | "gradient-secondary";
  className?: string;
  innerClassName?: string;
  alt?: string;
} & (
  | { Icon: ElementType; imageSrc?: never }
  | { Icon?: never; imageSrc: string }
);

export function GradientIcon({
  Icon,
  imageSrc,
  gradient,
  className = "",
  innerClassName = "bg-(--neutral-0)/80",
  alt = "",
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
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={alt}
            className="h-5 w-5 md:h-6 md:w-6 object-contain"
            loading="lazy"
          />
        ) : Icon ? (
          <Icon className="text-on-primary body-text-dark" fontSize="medium" />
        ) : null}
      </span>
    </span>
  );
}
