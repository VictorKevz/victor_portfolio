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
    },
    ref
  ) => {
    const inputId = id;
    const errorId = error ? `${id}-error` : undefined;
    const describedBy =
      [ariaDescribedBy, errorId].filter(Boolean).join(" ") || undefined;

    const baseInputClasses =
      "w-full px-4 py-3 bg-(--muted-alpha-50)! border rounded text-(--text-body) placeholder:text-(--text-subtle) focus:outline-none focus:ring-2 transition-colors";

    const inputStateClasses = error
      ? "border-(--error) focus:ring-(--error-alpha-20) focus:border-(--error)"
      : "border-(--border) focus:ring-(--accent-warm-alpha-20) focus:border-(--accent-warm)";

    return (
      <div>
        <label
          htmlFor={inputId}
          className="block text-(--foreground) text-sm font-medium mb-2"
        >
          {label}
          {required && (
            <span className="text-(--error) ml-1" aria-label="required">
              *
            </span>
          )}
        </label>
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
            className={`${baseInputClasses} ${inputStateClasses} resize-y`}
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
            className={`${baseInputClasses} ${inputStateClasses}`}
            ref={ref as React.Ref<HTMLInputElement>}
          />
        )}
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
