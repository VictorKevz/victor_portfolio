import Link from "next/link";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";

interface CTALinkProps {
  href: string;
  label: string;
  variant: "primary" | "secondary";
  className?: string;
}

export function CTALink({
  href,
  label,
  variant,
  className = "",
}: CTALinkProps) {
  const isPrimary = variant === "primary";

  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] px-6 h-13 rounded-full font-semibold transition-colors ${
        isPrimary
          ? "bg-gradient-primary primary-cta"
          : "surface-glass text-primary secondary-cta"
      } ${className}`}
    >
      <span>{label}</span>
      {isPrimary ? (
        <KeyboardDoubleArrowRightIcon fontSize="medium" />
      ) : (
        <MarkEmailReadIcon fontSize="medium" />
      )}
    </Link>
  );
}
