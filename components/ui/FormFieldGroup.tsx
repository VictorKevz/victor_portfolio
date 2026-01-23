"use client";

import { ReactNode } from "react";

interface FormFieldGroupProps {
  children: ReactNode;
  className?: string;
}

export function FormFieldGroup({ children, className = "" }: FormFieldGroupProps) {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 gap-6 ${className}`}
    >
      {children}
    </div>
  );
}

