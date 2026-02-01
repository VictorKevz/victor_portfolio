"use client";

import { useEffect, useRef, useState } from "react";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import type { Locale } from "@/lib/i18n/config";
import { getTranslation } from "@/lib/i18n/translations";
import { FormField } from "@/components/ui/FormField";
import { FormFieldGroup } from "@/components/ui/FormFieldGroup";
import { Button } from "@/components/ui/Button";
import { GradientIcon } from "@/components/ui/GradientIcon";
import { useToast } from "@/lib/contexts/ToastContext";
import { SectionLabel } from "@/components/ui/SectionLabel";

interface ContactSectionProps {
  locale: Locale;
}

export default function ContactSection({ locale }: ContactSectionProps) {
  const contact = getTranslation(locale, "contact") as {
    label: string;
    title: string;
    description: string;
    contacts: Array<{
      id: "email" | "phone" | "linkedin";
      label: string;
      value: string;
      href: string;
    }>;
    form: {
      labels: {
        firstName: string;
        lastName: string;
        email: string;
        service: string;
        message: string;
      };
      placeholders: {
        firstName: string;
        lastName: string;
        email: string;
        service: string;
        message: string;
      };
      serviceOptions: Array<{ value: string; label: string }>;
      submitLabel: string;
      successMessage: string;
      errorMessage: string;
      validation: {
        firstNameRequired: string;
        lastNameRequired: string;
        emailRequired: string;
        emailInvalid: string;
        serviceRequired: string;
        messageRequired: string;
      };
    };
  };

  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isServiceOpen, setIsServiceOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    service: "",
    message: "",
    company: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof formValues, string>>
  >({});
  const serviceMenuRef = useRef<HTMLDivElement | null>(null);

  const iconMap = {
    email: EmailIcon,
    phone: PhoneIcon,
    linkedin: LinkedInIcon,
  } as const;

  const baseInputClasses =
    "w-full px-4 h-12 bg-(--surface-glass-dark)! border border-transparent rounded-full text-(--body-text-light) placeholder:text-(--body-text-light-muted) focus:outline-none transition-colors";
  const labelClassName = "text-(--body-text-light) font-semibold ml-0.5";
  const inputClassName =
    "text-(--body-text-light) placeholder:text-(--body-text-light-muted) py-0 h-12 rounded-full";
  const textareaClassName = `${inputClassName} h-auto py-4 min-h-[6rem] rounded-xl`;
  const requiredClassName = "text-(--error)";
  const fieldWrapperClasses =
    "p-px transition-colors bg-(--border-soft) hover:bg-(--border-soft) focus-within:bg-(--border-soft) focus-within:ring-2 focus-within:ring-(--accent-warm-alpha-20)";
  const fieldWrapperErrorClasses =
    "p-px transition-colors bg-(--error) focus-within:ring-2 focus-within:ring-(--error-alpha-20)";

  const handleChange =
    (field: keyof typeof formValues) =>
    (
      event:
        | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | React.ChangeEvent<HTMLSelectElement>,
    ) => {
      setFormValues((prev) => ({ ...prev, [field]: event.target.value }));
    };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isServiceOpen &&
        serviceMenuRef.current &&
        !serviceMenuRef.current.contains(event.target as Node)
      ) {
        setIsServiceOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isServiceOpen]);

  const selectedServiceLabel =
    contact.form.serviceOptions.find(
      (option) => option.value === formValues.service,
    )?.label ?? "";

  const validateForm = () => {
    const nextErrors: Partial<Record<keyof typeof formValues, string>> = {};

    if (!formValues.firstName.trim()) {
      nextErrors.firstName = contact.form.validation.firstNameRequired;
    }

    if (!formValues.lastName.trim()) {
      nextErrors.lastName = contact.form.validation.lastNameRequired;
    }

    if (!formValues.email.trim()) {
      nextErrors.email = contact.form.validation.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email.trim())) {
      nextErrors.email = contact.form.validation.emailInvalid;
    }

    if (!formValues.service.trim()) {
      nextErrors.service = contact.form.validation.serviceRequired;
    }

    if (!formValues.message.trim()) {
      nextErrors.message = contact.form.validation.messageRequired;
    }

    return nextErrors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formValues,
          locale,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data?.success) {
        showToast(contact.form.errorMessage, "error");
        return;
      }

      showToast(contact.form.successMessage, "success");
      setFormValues({
        firstName: "",
        lastName: "",
        email: "",
        service: "",
        message: "",
        company: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Contact form submission failed", error);
      showToast(contact.form.errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="w-full text-on-primary relative overflow-hidden"
      aria-labelledby="contact-title"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-85"
        style={{ background: "var(--gradient-primary)" }}
      />
      <div className="relative z-10 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center lg:text-left">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] items-center justify-items-center lg:justify-items-stretch">
          <div className="text-left">
            <header className="max-w-xl text-left">
              <SectionLabel text={contact.label} />
              <h2
                id="contact-title"
                className="mt-4 text-4xl sm:text-5xl lg:text-7xl font-bold uppercase heading-text-dark max-w-sm"
              >
                {contact.title}
              </h2>
              <p className="mt-6 text-base sm:text-lg body-text-dark">
                {contact.description}
              </p>
            </header>

            {/* <dl
              className="mt-10 space-y-5 text-left"
              aria-label="Contact information"
            >
              {contact.contacts.map((item) => {
                const Icon = iconMap[item.id];
                return (
                  <div
                    key={item.id}
                    className="relative overflow-hidden rounded-2xl px-4 py-3 border border-dark shadow-(--shadow-elevated) text-left w-full sm:max-w-xs text-on-secondary"
                    style={{ background: "var(--dark-gradient)" }}
                  >
                    <dt className="uppercase tracking-[0.2em] text-xs body-text-light">
                      {item.label}
                    </dt>
                    <dd className="mt-2 flex items-center gap-3 text-sm sm:text-base font-semibold heading-text-light">
                      <GradientIcon
                        Icon={Icon}
                        gradient="gradient-secondary"
                        innerClassName={
                          item.id === "phone"
                            ? "bg-gradient-primary"
                            : "bg-(--neutral-0)/80"
                        }
                      />
                      <a
                        href={item.href}
                        {...(item.id === "linkedin"
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        {item.value}
                      </a>
                    </dd>
                  </div>
                );
              })}
            </dl> */}
          </div>

          <div
            className="rounded-[2.5rem] border border-(--border-light) shadow-(--shadow-elevated) p-6 sm:p-8 text-on-secondary w-full max-w-xl lg:max-w-none text-left"
            style={{ background: "var(--dark-gradient)" }}
          >
            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              <div className="sr-only" aria-hidden="true">
                <label htmlFor="company">Company</label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formValues.company}
                  onChange={handleChange("company")}
                />
              </div>
              <FormFieldGroup>
                <FormField
                  id="firstName"
                  label={contact.form.labels.firstName}
                  value={formValues.firstName}
                  onChange={handleChange("firstName")}
                  placeholder={contact.form.placeholders.firstName}
                  required
                  error={errors.firstName}
                  labelClassName={labelClassName}
                  inputClassName={inputClassName}
                  requiredClassName={requiredClassName}
                  wrapperClassName={
                    errors.firstName
                      ? fieldWrapperErrorClasses
                      : fieldWrapperClasses
                  }
                />
                <FormField
                  id="lastName"
                  label={contact.form.labels.lastName}
                  value={formValues.lastName}
                  onChange={handleChange("lastName")}
                  placeholder={contact.form.placeholders.lastName}
                  required
                  error={errors.lastName}
                  labelClassName={labelClassName}
                  inputClassName={inputClassName}
                  requiredClassName={requiredClassName}
                  wrapperClassName={
                    errors.lastName
                      ? fieldWrapperErrorClasses
                      : fieldWrapperClasses
                  }
                />
              </FormFieldGroup>

              <FormField
                id="email"
                type="email"
                label={contact.form.labels.email}
                value={formValues.email}
                onChange={handleChange("email")}
                placeholder={contact.form.placeholders.email}
                required
                error={errors.email}
                labelClassName={labelClassName}
                inputClassName={inputClassName}
                requiredClassName={requiredClassName}
                wrapperClassName={
                  errors.email ? fieldWrapperErrorClasses : fieldWrapperClasses
                }
              />

              <div>
                <label
                  htmlFor="service-trigger"
                  className="block text-(--body-text-light) text-sm font-semibold mb-2 ml-0.5"
                >
                  {contact.form.labels.service}
                  <span className="text-(--error) ml-1" aria-label="required">
                    *
                  </span>
                </label>
                <div className="relative" ref={serviceMenuRef}>
                  <div
                    className={`rounded-full ${
                      errors.service
                        ? fieldWrapperErrorClasses
                        : fieldWrapperClasses
                    }`}
                  >
                    <button
                      id="service-trigger"
                      type="button"
                      onClick={() => setIsServiceOpen((prev) => !prev)}
                      onKeyDown={(event) => {
                        if (event.key === "Escape") {
                          setIsServiceOpen(false);
                        }
                      }}
                      aria-haspopup="listbox"
                      aria-expanded={isServiceOpen}
                      aria-controls="service-options"
                      aria-invalid={errors.service ? "true" : "false"}
                      aria-describedby={
                        errors.service ? "service-error" : undefined
                      }
                      className={`${baseInputClasses} flex items-center justify-between pr-10`}
                    >
                      <span
                        className={
                          selectedServiceLabel
                            ? "text-(--body-text-light)"
                            : "text-(--body-text-light-muted)"
                        }
                      >
                        {selectedServiceLabel ||
                          contact.form.placeholders.service}
                      </span>
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-(--body-text-light-muted)">
                        <ExpandMoreIcon fontSize="small" />
                      </span>
                    </button>
                  </div>
                  {isServiceOpen && (
                    <ul
                      id="service-options"
                      role="listbox"
                      aria-label={contact.form.labels.service}
                      className="absolute z-50 mt-2 w-full rounded-xl border border-(--border-light) bg-(--neutral-1000) shadow-(--shadow-elevated) overflow-hidden text-left divide-y divide-(--border-light)"
                    >
                      {contact.form.serviceOptions.map((option) => (
                        <li
                          key={option.value}
                          role="option"
                          aria-selected={formValues.service === option.value}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setFormValues((prev) => ({
                                ...prev,
                                service: option.value,
                              }));
                              setIsServiceOpen(false);
                            }}
                            className="w-full px-4 py-3 text-sm text-(--body-text-light) transition-colors hover:bg-(--navy-700) focus:outline-none focus-visible:outline-2 focus-visible:outline-(--accent-warm) flex items-center justify-between text-left"
                          >
                            <span className="capitalize">{option.label}</span>
                            <KeyboardArrowRightIcon
                              className="text-(--body-text-light-muted)"
                              fontSize="small"
                            />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {errors.service && (
                  <p
                    id="service-error"
                    className="mt-2 text-sm text-(--error)"
                    role="alert"
                  >
                    {errors.service}
                  </p>
                )}
              </div>

              <FormField
                id="message"
                type="textarea"
                label={contact.form.labels.message}
                value={formValues.message}
                onChange={handleChange("message")}
                placeholder={contact.form.placeholders.message}
                required
                rows={4}
                error={errors.message}
                labelClassName={labelClassName}
                inputClassName={textareaClassName}
                requiredClassName={requiredClassName}
                wrapperClassName={
                  errors.message
                    ? fieldWrapperErrorClasses
                    : fieldWrapperClasses
                }
                wrapperRadiusClassName="rounded-xl"
              />

              <Button
                type="submit"
                isLoading={isSubmitting}
                className="w-full bg-gradient-primary text-on-primary cta primary-cta rounded-full"
              >
                {contact.form.submitLabel}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
