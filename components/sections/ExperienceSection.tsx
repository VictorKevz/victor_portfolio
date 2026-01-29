"use client";

import { useMemo, useRef, useState } from "react";
import RoomOutlinedIcon from "@mui/icons-material/RoomOutlined";
import EngineeringOutlinedIcon from "@mui/icons-material/EngineeringOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import type { Locale } from "@/lib/i18n/config";
import { getTranslation } from "@/lib/i18n/translations";
import { SectionLabel } from "@/components/ui/SectionLabel";

interface ExperienceSectionProps {
  locale: Locale;
}

export default function ExperienceSection({ locale }: ExperienceSectionProps) {
  const experience = getTranslation(locale, "experience") as {
    header: {
      label: string;
      title: string;
      subtitle: string;
      toggleOptions: {
        professional: string;
        academic: string;
      };
    };
    work: Array<{
      dateRange: string;
      location: string;
      role: string;
      company: string;
      achievements: string[];
      tags: string[];
    }>;
    education: Array<{
      dateRange: string;
      location: string;
      degree: string;
      institution: string;
      details: string[];
      tags: string[];
    }>;
  };

  const tabs = useMemo(
    () => [
      {
        id: "professional",
        label: experience.header.toggleOptions.professional,
      },
      { id: "academic", label: experience.header.toggleOptions.academic },
    ],
    [
      experience.header.toggleOptions.academic,
      experience.header.toggleOptions.professional,
    ],
  );

  const [activeTab, setActiveTab] = useState<"professional" | "academic">(
    "professional",
  );

  const tabRefs = useRef<
    Record<"professional" | "academic", HTMLButtonElement | null>
  >({
    professional: null,
    academic: null,
  });

  const isProfessional = activeTab === "professional";

  const gradients = ["gradient-primary", "gradient-secondary"] as const;
  const gradientIconColors = {
    "gradient-primary": "var(--gradient-primary-right)",
    "gradient-secondary": "var(--gradient-secondary-right)",
  } as const;
  const workIcons = [
    EngineeringOutlinedIcon,
    GroupsOutlinedIcon,
    BusinessCenterOutlinedIcon,
  ] as const;
  const educationIcons = [SchoolOutlinedIcon, AutoStoriesOutlinedIcon] as const;

  const titleWords = experience.header.title.split(" ");
  const titleMain = titleWords.slice(0, -1).join(" ");
  const titleAccent = titleWords[titleWords.length - 1] ?? "";

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
      return;
    }

    event.preventDefault();
    const nextTab = activeTab === "professional" ? "academic" : "professional";
    setActiveTab(nextTab);
    tabRefs.current[nextTab]?.focus();
  };

  return (
    <section
      id="experience"
      className="w-full text-on-secondary"
      aria-labelledby="experience-title"
      style={{ background: "var(--dark-gradient)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <header className="w-full flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="w-full flex flex-col items-start gap-4">
            <SectionLabel
              text={experience.header.label}
              variant="dark"
              className="order-0"
            />
            <h2
              id="experience-title"
              className="order-1 flex flex-wrap gap-2 text-3xl sm:text-4xl lg:text-7xl font-semibold uppercase heading-text-light"
            >
              {titleWords.length > 1 ? (
                <>
                  <span>{titleMain} </span>
                  <span className="text-gradient">{titleAccent}</span>
                </>
              ) : (
                <span className="text-gradient">{experience.header.title}</span>
              )}
            </h2>
            <p className="order-2 mt-4 text-base sm:text-lg body-text-light">
              {experience.header.subtitle}
            </p>
          </div>
          <div
            className="relative flex w-full max-w-xs items-center rounded-full surface-glass p-1 backdrop-blur"
            role="tablist"
            aria-label={experience.header.title}
            onKeyDown={handleTabKeyDown}
          >
            <span
              aria-hidden="true"
              className={`absolute inset-y-1 left-1 w-[calc(50%-0.5rem)] rounded-full bg-gradient-primary transition-transform duration-300 ease-out motion-reduce:transition-none ${
                activeTab === "professional"
                  ? "translate-x-0"
                  : "translate-x-full"
              }`}
            />
            {tabs.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  ref={(node) => {
                    tabRefs.current[tab.id as "professional" | "academic"] =
                      node;
                  }}
                  id={`experience-tab-${tab.id}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`experience-panel-${tab.id}`}
                  tabIndex={isActive ? 0 : -1}
                  className={`relative z-10 flex-1 rounded-full px-3 py-2 text-[0.6rem] sm:text-[0.65rem] font-semibold uppercase tracking-[0.3em] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--border-light) ${
                    isActive ? "text-on-primary" : "text-muted"
                  }`}
                  onClick={() =>
                    setActiveTab(tab.id as "professional" | "academic")
                  }
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </header>

        {tabs.map((tab) => {
          const isTabProfessional = tab.id === "professional";
          const items = isTabProfessional
            ? experience.work
            : experience.education;
          return (
            <div
              key={tab.id}
              id={`experience-panel-${tab.id}`}
              role="tabpanel"
              aria-labelledby={`experience-tab-${tab.id}`}
              hidden={activeTab !== tab.id}
              className="relative mt-12 w-full"
            >
              <div className="absolute left-4 top-0 h-full w-px bg-(--border-light)/60 md:left-1/2 md:-translate-x-1/2" />
              <ul
                className="relative flex flex-col gap-10"
                aria-label={`${experience.header.title} ${tab.label}`}
              >
                {items.map((item, index) => {
                  const gradient = gradients[index % gradients.length];
                  const Icon = (isTabProfessional ? workIcons : educationIcons)[
                    index %
                      (isTabProfessional
                        ? workIcons.length
                        : educationIcons.length)
                  ];
                  const isLeft = index % 2 === 0;
                  const title = isTabProfessional
                    ? (item as (typeof experience.work)[number]).role
                    : (item as (typeof experience.education)[number]).degree;
                  const subtitle = isTabProfessional
                    ? (item as (typeof experience.work)[number]).company
                    : (item as (typeof experience.education)[number])
                        .institution;
                  const bullets = isTabProfessional
                    ? (item as (typeof experience.work)[number]).achievements
                    : (item as (typeof experience.education)[number]).details;

                  return (
                    <li
                      key={`${title}-${subtitle}-${item.dateRange}`}
                      className="relative pl-10 md:pl-0 grid md:grid-cols-[minmax(0,1fr)_2.5rem_minmax(0,1fr)]"
                    >
                      <div
                        className="absolute left-4 top-10 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full p-px md:left-1/2 md:-translate-x-1/2"
                        style={{ background: `var(--${gradient})` }}
                      >
                        <span className="flex h-full w-full items-center justify-center rounded-full bg-(--dark-background)">
                          <span className="h-1.5 w-1.5 rounded-full bg-(--neutral-0)/70" />
                        </span>
                      </div>
                      <div
                        className={`w-full max-w-lg ${
                          isLeft
                            ? "md:col-start-1 md:pr-6 md:justify-self-start"
                            : "md:col-start-3 md:pl-6 md:justify-self-end"
                        }`}
                      >
                        <div className="rounded-4xl">
                          <article className="relative rounded-[1.95rem] bg-(--dark-background) border border-(--border-light) p-6 shadow-2xl">
                            <Icon className="absolute right-5 top-5 text-2xl heading-text-light opacity-30" />
                            <div className="flex flex-wrap items-center gap-3 text-[0.6rem] uppercase tracking-[0.25em] text-muted">
                              <span
                                className="inline-flex rounded-full p-px"
                                style={{
                                  background: "var(--gradient-primary)",
                                }}
                              >
                                <span className="rounded-full bg-(--dark-background) px-3 py-1 text-[0.55rem] text-on-secondary">
                                  {item.dateRange}
                                </span>
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <RoomOutlinedIcon className="text-sm" />
                                {item.location}
                              </span>
                            </div>
                            <h3 className="mt-4 text-base sm:text-lg font-semibold uppercase heading-text-light">
                              {title}
                            </h3>
                            <p className="mt-1 text-sm text-(--body-text-light-muted)">
                              {subtitle}
                            </p>
                            <ul className="mt-5 flex flex-col gap-3">
                              {bullets.map((detail) => (
                                <li
                                  key={detail}
                                  className="flex gap-3 text-base text-(--body-text-light-muted)/90!"
                                >
                                  <CheckCircleOutlineIcon
                                    className="mt-0.5"
                                    fontSize="small"
                                    style={{
                                      color: gradientIconColors[gradient],
                                    }}
                                  />
                                  <span className="text-(--body-text-light-muted)/80!">
                                    {detail}
                                  </span>
                                </li>
                              ))}
                            </ul>
                            <div className="mt-6 h-px bg-(--border-light)/60" />
                            <div className="mt-4 flex flex-wrap gap-2">
                              {item.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-md border border-(--border-light) px-2 py-1 text-[0.55rem] uppercase tracking-[0.2em] text-(--body-text-light)"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </article>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
