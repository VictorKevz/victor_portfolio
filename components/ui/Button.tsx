import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      isLoading = false,
      disabled,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center gap-2 justify-center px-6 py-3 rounded font-medium text-base transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variantStyles = {
      primary:
        "bg-(--accent-warm) text-(--background) hover:opacity-90 focus-visible:outline-(--accent-warm)",
      secondary:
        "bg-(--secondary) text-(--foreground) border border-(--border) hover:bg-(--muted) focus-visible:outline-(--accent-warm)",
    };

    return (
      <button
        ref={ref}
        type={props.type || "button"}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="loader-spin" aria-hidden="true" />
            <span className="sr-only">Loading...</span>
          </>
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
