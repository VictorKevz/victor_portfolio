interface GradientTextProps {
  text: string;
  className?: string;
  variant?: "primary" | "secondary";
}

export function GradientText({
  text,
  className = "",
  variant = "primary",
}: GradientTextProps) {
  const gradientClass =
    variant === "secondary" ? "text-gradient-secondary" : "text-gradient";

  return (
    <span className={`${gradientClass} font-bold ${className}`}>{text}</span>
  );
}
