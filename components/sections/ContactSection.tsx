"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { FormFieldGroup } from "@/components/ui/FormFieldGroup";
import { useToast } from "@/lib/contexts/ToastContext";
import { getTranslation } from "@/lib/i18n/translations";
import type { Locale } from "@/lib/i18n/config";
import type { ContactSection as ContactSectionData } from "@/lib/wordpress/types";

interface ContactSectionProps {
  data: ContactSectionData;
  locale: Locale;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  message?: string;
  submit?: string;
}

export default function ContactSection({ data, locale }: ContactSectionProps) {
  const t = (key: string) => getTranslation(locale, key);
  const { showToast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getFieldError = (key: string): string => {
    const val = t(`contact.form.errors.${key}`);
    return typeof val === "string" ? val : key;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = getFieldError("firstNameRequired");
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = getFieldError("firstNameTooShort");
    } else if (formData.firstName.length > 100) {
      newErrors.firstName = getFieldError("firstNameTooLong");
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = getFieldError("lastNameRequired");
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = getFieldError("lastNameTooShort");
    } else if (formData.lastName.length > 100) {
      newErrors.lastName = getFieldError("lastNameTooLong");
    }

    if (!formData.email.trim()) {
      newErrors.email = getFieldError("emailRequired");
    } else if (formData.email.length > 254) {
      newErrors.email = getFieldError("emailTooLong");
    } else if (!validateEmail(formData.email)) {
      newErrors.email = getFieldError("emailInvalid");
    }

    if (formData.message && formData.message.length > 5000) {
      newErrors.message = getFieldError("messageTooLong");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, locale }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorCode = data.errorCode || "UNKNOWN_ERROR";
        const errorKeyMap: Record<string, string> = {
          VALIDATION_ERROR: "contact.errorValidation",
          CONFIG_ERROR: "contact.errorConfigError",
          UPDATE_FAILED: "contact.errorUpdateFailed",
          BREVO_ERROR: "contact.errorBrevoError",
          NETWORK_ERROR: "contact.errorNetwork",
          SERVER_ERROR: "contact.errorServer",
          UNKNOWN_ERROR: "contact.errorUnknown",
        };

        const translationKey = errorKeyMap[errorCode] || "contact.error";
        const val = t(translationKey);
        const errorMessage =
          typeof val === "string"
            ? val
            : "Something went wrong. Please try again.";

        throw new Error(errorMessage);
      }

      const updated = data.updated || false;

      const successMsg = updated
        ? typeof t("contact.successUpdated") === "string"
          ? (t("contact.successUpdated") as string)
          : "Your information has been updated."
        : typeof t("contact.success") === "string"
        ? (t("contact.success") as string)
        : "Thank you! You're on the list.";

      showToast(successMsg, "success");
      setFormData({ firstName: "", lastName: "", email: "", message: "" });
    } catch (error) {
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        const val = t("contact.errorNetwork");
        const networkError =
          typeof val === "string"
            ? val
            : "Connection error. Please check your internet connection.";
        showToast(networkError, "error");
      } else {
        const errorMsg =
          error instanceof Error
            ? error.message
            : typeof t("contact.error") === "string"
            ? (t("contact.error") as string)
            : "Error sending message";

        showToast(errorMsg, "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 sm:py-16 lg:py-24">
      <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-left md:text-center mb-8 sm:mb-10">
            {data.label && (
              <p className="text-subtle text-sm uppercase tracking-wider font-medium ">
                {data.label}
              </p>
            )}

            {data.title && (
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-hero mb-4 leading-tight">
                {data.title}
              </h2>
            )}

            {data.description && (
              <div className="">
                <p className="text-body text-base sm:text-lg leading-relaxed">
                  {data.description}
                </p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* First Name and Last Name Fields */}
            <FormFieldGroup>
              <FormField
                id="firstName"
                label={data.contact_form_fields?.["field-1"]?.field_label || "First Name"}
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                placeholder={data.contact_form_fields?.["field-1"]?.placeholder_text || ""}
                required
                error={errors.firstName}
              />
              <FormField
                id="lastName"
                label={data.contact_form_fields?.["field-2"]?.field_label || "Last Name"}
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                placeholder={data.contact_form_fields?.["field-2"]?.placeholder_text || ""}
                required
                error={errors.lastName}
              />
            </FormFieldGroup>

            {/* Email Field */}
            <FormField
              id="email"
              label={data.contact_form_fields?.["field-3"]?.field_label || "Email"}
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={data.contact_form_fields?.["field-3"]?.placeholder_text || ""}
              required
              error={errors.email}
            />

            {/* Message Field */}
            <FormField
              id="message"
              label={data.contact_form_fields?.["field-4"]?.field_label || "Message"}
              type="textarea"
              value={formData.message}
              onChange={handleChange}
              placeholder={data.contact_form_fields?.["field-4"]?.placeholder_text || ""}
              error={errors.message}
            />

            {/* Submit Button */}
            <div>
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                disabled={isSubmitting}
                className="w-full font-semibold text-(--background)! hover:bg-transparent! hover:text-(--accent-warm)! hover:border! hover:border-(--accent-warm)! transition-all duration-200"
              >
                {data.send_button_text || "Send"}
              </Button>
            </div>

            {/* Privacy Note */}
            {data.data_handling_policy_note && (
              <p className="text-subtle text-sm text-center mt-4">
                {data.data_handling_policy_note}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
