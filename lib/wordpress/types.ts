export interface HeroDescriptions {
  description_1?: string;
  description_2?: string;
  description_3?: string;
  description_4?: string;
}

export interface HeroSection {
  hero_title?: string;
  hero_subheading?: string;
  hero_blockquote?: string;
  hero_descriptions?: HeroDescriptions;
  hero_cta?: string;
  hero_blog_cta?: string;
}

export interface MarkkuFeatures {
  feature_1?: string;
  feature_2?: string;
  feature_3?: string;
}

export interface MarkkuSectionDescriptions {
  description_1?: string;
  description_2?: string;
  description_3?: string;
}

export interface MarkkuSection {
  markku_welcome_video?: string;
  author?: string;
  title?: string;
  features?: MarkkuFeatures;
  markku_section_descriptions?: MarkkuSectionDescriptions;
}

export interface ContactFormField {
  field_label?: string;
  placeholder_text?: string;
}

export interface ContactFormFields {
  "field-1"?: ContactFormField;
  "field-2"?: ContactFormField;
  "field-3"?: ContactFormField;
  "field-4"?: ContactFormField;
}

export interface ContactSection {
  label?: string;
  title?: string;
  description?: string;
  contact_policy?: string;
  contact_form_fields?: ContactFormFields;
  send_button_text?: string;
  data_handling_policy_note?: string;
}

export interface SeoMeta {
  meta_title?: string;
  meta_description?: string;
  canonical?: string;
}

export interface HomePageACF {
  hero_section: HeroSection;
  markku_section: MarkkuSection;
  contact_section: ContactSection;
  seo_en?: SeoMeta;
  seo_fi?: SeoMeta;
}

export interface HomePageData {
  acf: HomePageACF;
}

// Blog Post Types
export interface BlogPostHeader {
  content_lang?: "en" | "fi";
  parent_pillar?:
    | number
    | {
        ID?: number;
        post_name?: string;
        post_title?: string;
      };
  translation_post?:
    | {
        ID?: number;
        post_name?: string;
        post_title?: string;
      }
    | false;
  author?: string;
  post_ingress?: string;
  read_time?: number;
}

export interface BlogPostQuickOverview {
  overview_why?: string;
  overview_mistakes?: string;
  overview_routine?: string;
  overview_expert?: string;
  overview_suitability?: string;
  overview_summary?: string;
}

export interface BlogPostBody {
  quick_overview?: BlogPostQuickOverview;
  content_why_it_matters?: string;
  content_common_mistakes?: string;
  content_routine_steps?: string;
}

export interface BlogPostSummarySection {
  "3_line_summary"?: string;
  next_step_cta?: string;
}

export interface BlogPostOthers {
  content_expert_insight?: string;
  content_suitability_check?: string;
  content_summary_section?: BlogPostSummarySection;
}

export interface BlogPostACF {
  blog_post?: {
    header?: BlogPostHeader;
    body?: BlogPostBody;
    others?: BlogPostOthers;
  };
}

export interface BlogPost {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  categories: number[];
  tags: number[];
  acf?: BlogPostACF;
}

export interface PillarPost {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  link: string;
  acf?: {
    pillar_data?: PillarData;
    [key: string]: unknown;
  };
}

export interface PillarData {
  content_lang?: "en" | "fi";
  pillar_intro?: string;
  pillar_expert_view?: string;
  translation_pillar?:
    | {
        ID?: number;
        post_name?: string;
        post_title?: string;
      }
    | false;
}

export interface BlogHubHeaderContent {
  hub_title?: string;
  hub_description?: string;
  hub_subtext?: string;
}

export interface BlogHubSettingsACF {
  hub_header_data?: {
    en?: BlogHubHeaderContent;
    fi?: BlogHubHeaderContent;
  };
}

export interface BlogHubSettingsPage {
  acf?: BlogHubSettingsACF;
}

