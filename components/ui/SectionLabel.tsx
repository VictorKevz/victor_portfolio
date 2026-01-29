interface SectionLabelProps {
  text: string;
  variant?: "light" | "dark";
  className?: string;
}

export function SectionLabel({
  text,
  variant = "light",
  className = "",
}: SectionLabelProps) {
  const styles =
    variant === "dark"
      ? "border-(--border-light) bg-(--dark-background)/60 text-(--body-text-light)"
      : "border-(--border-dark) bg-(--neutral-0)/80 heading-text-dark";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] ${styles} ${className}`}
    >
      {text}
    </span>
  );
}
