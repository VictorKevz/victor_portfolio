"use client";

import { forwardRef } from "react";

interface FormFieldProps {
  id: string;
  label: string;
  type?: "text" | "email" | "tel" | "textarea";
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  ariaDescribedBy?: string;
  rows?: number;
  labelClassName?: string;
  inputClassName?: string;
  requiredClassName?: string;
  wrapperClassName?: string;
  wrapperRadiusClassName?: string;
}

export const FormField = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  FormFieldProps
>(
  (
    {
      id,
      label,
      type = "text",
      value,
      onChange,
      placeholder,
      required = false,
      error,
      ariaDescribedBy,
      rows = 5,
      labelClassName = "",
      inputClassName = "",
      requiredClassName = "text-(--error)",
      wrapperClassName = "",
      wrapperRadiusClassName = "rounded-full",
    },
    ref
  ) => {
    const inputId = id;
    const errorId = error ? `${id}-error` : undefined;
    const describedBy =
      [ariaDescribedBy, errorId].filter(Boolean).join(" ") || undefined;

    const baseInputClasses =
      "w-full px-4 h-12 bg-(--surface-glass-dark) border border-transparent text-(--body-text-light) placeholder:text-(--body-text-light-muted) focus:outline-none transition-colors";

    const wrapperBorderClasses = error
      ? "bg-(--error)"
      : "bg-(--border-soft) hover:bg-(--border-soft) focus-within:bg-(--border-soft)";

    const wrapperRingClasses = error
      ? "focus-within:ring-2 focus-within:ring-(--error-alpha-20)"
      : "focus-within:ring-2 focus-within:ring-(--accent-warm-alpha-20)";

    return (
      <div>
        <label
          htmlFor={inputId}
          className={`block text-sm font-medium mb-2 ${labelClassName}`}
        >
          {label}
          {required && (
            <span className={`${requiredClassName} ml-1`} aria-label="required">
              *
            </span>
          )}
        </label>
        <div
          className={`p-px ${wrapperRadiusClassName} transition-colors ${wrapperBorderClasses} ${wrapperRingClasses} ${wrapperClassName}`}
        >
          {type === "textarea" ? (
            <textarea
              id={inputId}
              name={id}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              required={required}
              rows={rows}
              aria-required={required}
              aria-invalid={error ? "true" : "false"}
              aria-describedby={describedBy}
              className={`${baseInputClasses} ${inputClassName} resize-y ${wrapperRadiusClassName}`}
              ref={ref as React.Ref<HTMLTextAreaElement>}
            />
          ) : (
            <input
              id={inputId}
              name={id}
              type={type}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              required={required}
              aria-required={required}
              aria-invalid={error ? "true" : "false"}
              aria-describedby={describedBy}
              className={`${baseInputClasses} ${inputClassName} ${wrapperRadiusClassName}`}
              ref={ref as React.Ref<HTMLInputElement>}
            />
          )}
        </div>
        {error && (
          <p id={errorId} className="mt-2 text-sm text-(--error)" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";
