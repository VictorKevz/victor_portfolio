export interface ProjectsLabels {
  techStack: string;
  results: string;
  performance: string;
  accessibility: string;
  bestPractices: string;
  seo: string;
  otherMetrics: string;
  caseStudy: string;
  github: string;
  liveSite: string;
  carouselPrev: string;
  carouselNext: string;
  imagePlaceholder: string;
  showMore: string;
  showLess: string;
}

export interface ProjectMedia {
  type: "image" | "video";
  src: string;
  alt: string;
  poster?: string;
}

export interface ProjectLinks {
  case_study?: string;
  case_study_label?: string;
  github?: string;
  live_site?: string;
}

export interface ProjectResults {
  performance_lighthouse: string | null;
  accessibility_lighthouse: string | null;
  best_practices_lighthouse: string | null;
  seo_lighthouse: string | null;
  other_metrics: string[];
}

export interface ProjectItem {
  id: string;
  project_name: string;
  project_title: string;
  description: string;
  media: ProjectMedia[];
  tech_stack: string[];
  results: ProjectResults;
  links: ProjectLinks;
  isHidden?: boolean;
}

export interface SlideItem extends ProjectMedia {
  isPlaceholder: boolean;
}
