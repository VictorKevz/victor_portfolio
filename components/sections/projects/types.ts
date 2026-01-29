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

export interface ProjectImage {
  src: string;
  alt: string;
}

export interface ProjectLinks {
  case_study?: string;
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
  images: ProjectImage[];
  tech_stack: string[];
  results: ProjectResults;
  links: ProjectLinks;
}

export interface SlideItem extends ProjectImage {
  isPlaceholder: boolean;
}
