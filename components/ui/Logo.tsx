import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  href?: string;
  label: string;
  showLabel?: boolean;
  onClick?: () => void;
  className?: string;
  iconClassName?: string;
  labelClassName?: string;
}

export function Logo({
  href,
  label,
  showLabel = false,
  onClick,
  className = "",
  iconClassName = "",
  labelClassName = "",
}: LogoProps) {
  const content = (
    <>
      <span
        className={`flex items-center justify-center rounded-full surface-glass backdrop-blur ${iconClassName}`}
      >
        <Image src="/victor_logo.webp" alt={`${label} logo`} width={34} height={34} />
      </span>
      {showLabel ? (
        <span className={`text-base font-semibold text-primary ${labelClassName}`}>
          {label}
        </span>
      ) : null}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={`flex items-center gap-3 text-primary ${className}`}
        aria-label={label}
      >
        {content}
      </Link>
    );
  }

  return (
    <div className={`flex items-center gap-3 text-primary ${className}`}>
      {content}
    </div>
  );
}
