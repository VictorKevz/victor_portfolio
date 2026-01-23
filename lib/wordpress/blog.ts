import type {
  BlogHubSettingsPage,
  BlogHubHeaderContent,
  BlogPost,
  PillarPost,
} from "./types";
import { isValidLocale, type Locale } from "@/lib/i18n/config";

/**
 * Gets the WordPress base URL from environment or constructs it
 * Falls back to the known endpoint structure if not configured
 */
function getWpBaseUrl(): string {
  const baseUrl = process.env.WP_BASE_URL;
  if (baseUrl) {
    return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  }
  // Fallback to known structure
  return "https://wp.markkutauriainen.com/wp-json/wp/v2";
}

/**
 * Generic WordPress API fetch function with caching and error handling
 * @param endpoint - Full endpoint URL or path relative to base
 * @param tags - Cache tags for revalidation
 * @param options - Additional fetch options
 */
async function fetchWpApi<T>(
  endpoint: string,
  tags: string[] = [],
  options: RequestInit = {}
): Promise<T> {
  // If endpoint is already a full URL, use it; otherwise prepend base URL
  const fullUrl = endpoint.startsWith("http")
    ? endpoint
    : `${getWpBaseUrl()}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const response = await fetch(fullUrl, {
    next: {
      tags: ["wordpress", "blog", ...tags],
      revalidate: 300, // 5 minutes default revalidation
    },
    cache: "force-cache",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(
      `WordPress API error: ${response.status} ${response.statusText} - ${fullUrl}`
    );
  }

  return response.json();
}

/**
 * Blog hub settings page ID (WordPress page with ACF hub_header_data)
 */
const BLOG_HUB_PAGE_ID = 424;

/**
 * Request deduplication map to avoid parallel identical requests
 */
const pendingRequests = new Map<string, Promise<unknown>>();

/**
 * Deduplicated fetch - ensures identical requests are only made once
 */
async function fetchDeduplicated<T>(
  key: string,
  fetcher: () => Promise<T>
): Promise<T> {
  const existing = pendingRequests.get(key);
  if (existing) {
    return existing as Promise<T>;
  }

  const promise = fetcher().finally(() => {
    pendingRequests.delete(key);
  });

  pendingRequests.set(key, promise);
  return promise;
}

/**
 * Validates that a post has required ACF fields
 * @param post - The blog post to validate
 * @returns true if post has valid ACF structure
 */
function getParentPillarId(post: BlogPost): number | null {
  const parent = post.acf?.blog_post?.header?.parent_pillar;
  if (!parent) {
    return null;
  }
  if (typeof parent === "number") {
    return parent;
  }
  if (typeof parent === "object" && typeof parent.ID === "number") {
    return parent.ID;
  }
  return null;
}

function hasValidAcfStructure(post: BlogPost): boolean {
  return !!(
    post.acf?.blog_post?.header?.content_lang && getParentPillarId(post)
  );
}

/**
 * Filters posts by locale using ACF content_lang field
 * Also validates ACF structure
 */
function filterPostsByLocale(posts: BlogPost[], locale: Locale): BlogPost[] {
  return posts.filter((post) => {
    if (!hasValidAcfStructure(post)) {
      // Log warning in development but don't throw
      if (process.env.NODE_ENV === "development") {
        console.warn(
          `Post ${post.id} (${post.slug}) missing required ACF fields (content_lang or parent_pillar)`
        );
      }
      return false;
    }
    const contentLang = post.acf?.blog_post?.header?.content_lang;
    return contentLang === locale;
  });
}

/**
 * Gets all blog posts from WordPress
 * @param locale - Filter by locale ('en' or 'fi')
 * @param fields - Specific fields to request (reduces payload)
 * @param perPage - Number of posts per page (max 100)
 */
async function getAllPosts(
  locale: Locale,
  fields: string[] = [],
  perPage: number = 100
): Promise<BlogPost[]> {
  const params = new URLSearchParams({
    per_page: perPage.toString(),
    acf_format: "standard",
    status: "publish",
  });

  if (fields.length > 0) {
    params.append("_fields", fields.join(","));
  }

  const key = `posts-${locale}-${fields.join(",")}-${perPage}`;
  return fetchDeduplicated(key, async () => {
    const posts = await fetchWpApi<BlogPost[]>(
      `/posts?${params.toString()}`,
      ["posts", `posts-${locale}`]
    );

    // Filter by locale since WordPress may not support meta queries for ACF
    return filterPostsByLocale(posts, locale);
  });
}

/**
 * Gets all blog posts for sitemap generation (minimal fields)
 */
export async function getBlogPostsForSitemap(
  locale: Locale
): Promise<BlogPost[]> {
  return getAllPosts(locale, ["id", "slug", "modified", "acf"], 100);
}

/**
 * Gets unique pillar IDs from posts
 */
function extractPillarIds(posts: BlogPost[]): number[] {
  const pillarIds = new Set<number>();
  posts.forEach((post) => {
    const pillarId = getParentPillarId(post);
    if (pillarId) {
      pillarIds.add(pillarId);
    }
  });
  return Array.from(pillarIds);
}

/**
 * Gets all blog pillars (categories) for a given locale
 * @param locale - The locale to filter posts by
 * @returns Array of pillar posts with their details
 */
export async function getBlogPillars(locale: Locale): Promise<PillarPost[]> {
  if (!isValidLocale(locale)) {
    throw new Error(`Invalid locale: ${locale}`);
  }

  // Fetch all pillars directly (no dependency on posts)
  const params = new URLSearchParams({
    per_page: "100",
    acf_format: "standard",
    _fields: "id,slug,title,link,acf",
  });

  const key = `pillars-${locale}-all`;
  const pillars = await fetchDeduplicated(key, async () => {
    return fetchWpApi<PillarPost[]>(
      `/pillar?${params.toString()}`,
      ["pillars", `pillars-${locale}`]
    );
  });

  // Filter pillars by locale using ACF pillar_data.content_lang
  const filtered = pillars.filter((pillar) => {
    const contentLang = pillar.acf?.pillar_data?.content_lang;
    return contentLang === locale;
  });

  if (process.env.NODE_ENV === "development") {
    console.debug(
      `[blog] getBlogPillars(${locale}): fetched ${filtered.length}/${pillars.length} pillars`
    );
  }

  return filtered;
}

/**
 * Gets blog hub header content from the settings page (ACF only)
 * @param locale - The locale to use ('en' or 'fi')
 */
export async function getBlogHubHeader(
  locale: Locale
): Promise<BlogHubHeaderContent | null> {
  if (!isValidLocale(locale)) {
    throw new Error(`Invalid locale: ${locale}`);
  }

  const params = new URLSearchParams({
    acf_format: "standard",
    _fields: "acf",
  });

  const key = `blog-hub-header-${locale}`;
  const page = await fetchDeduplicated(key, async () => {
    return fetchWpApi<BlogHubSettingsPage>(
      `/pages/${BLOG_HUB_PAGE_ID}?${params.toString()}`,
      ["blog-hub", `blog-hub-${locale}`]
    );
  });

  const headerData =
    locale === "en"
      ? page.acf?.hub_header_data?.en
      : page.acf?.hub_header_data?.fi;

  return headerData ?? null;
}

/**
 * Gets posts by pillar ID for a given locale
 * @param locale - The locale to filter by
 * @param pillarId - The parent pillar ID
 * @param page - Optional page number for pagination
 * @param perPage - Posts per page (default 10)
 */
export async function getPostsByPillar(
  locale: Locale,
  pillarId: number,
  page: number = 1,
  perPage: number = 10
): Promise<BlogPost[]> {
  if (!isValidLocale(locale)) {
    throw new Error(`Invalid locale: ${locale}`);
  }

  if (!pillarId || typeof pillarId !== "number") {
    throw new Error(`Invalid pillarId: ${pillarId}`);
  }

  // Fetch posts with minimal fields for listing
  const fields = [
    "id",
    "slug",
    "title",
    "date",
    "excerpt",
    "link",
    "acf",
    "modified",
  ];

  const params = new URLSearchParams({
    per_page: perPage.toString(),
    page: page.toString(),
    acf_format: "standard",
    status: "publish",
    _fields: fields.join(","),
  });

  const key = `posts-pillar-${pillarId}-${locale}-${page}-${perPage}`;
  const allPosts = await fetchDeduplicated(key, async () => {
    return fetchWpApi<BlogPost[]>(
      `/posts?${params.toString()}`,
      ["posts", `posts-pillar-${pillarId}`, `posts-${locale}`]
    );
  });

  // Filter by pillar ID and locale, with validation
  return allPosts.filter((post) => {
    if (!hasValidAcfStructure(post)) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          `Post ${post.id} (${post.slug}) missing required ACF fields, skipping`
        );
      }
      return false;
    }
    const postPillarId = getParentPillarId(post);
    const contentLang = post.acf?.blog_post?.header?.content_lang;
    return postPillarId === pillarId && contentLang === locale;
  });
}

/**
 * Gets a single blog post by slug
 * @param locale - The locale to filter by
 * @param slug - The post slug
 * @throws Error if post is found but missing required ACF fields
 */
export async function getPostBySlug(
  locale: Locale,
  slug: string
): Promise<BlogPost | null> {
  if (!isValidLocale(locale)) {
    throw new Error(`Invalid locale: ${locale}`);
  }

  if (!slug) {
    throw new Error("Slug is required");
  }

  const params = new URLSearchParams({
    slug,
    acf_format: "standard",
    status: "publish",
  });

  const key = `post-slug-${slug}-${locale}`;
  const posts = await fetchDeduplicated(key, async () => {
    return fetchWpApi<BlogPost[]>(
      `/posts?${params.toString()}`,
      ["posts", `post-${slug}`, `posts-${locale}`]
    );
  });

  // Filter by locale and return first match
  const filtered = filterPostsByLocale(posts, locale);
  const post = filtered.length > 0 ? filtered[0] : null;

  // Validate critical fields for single post
  if (post && !hasValidAcfStructure(post)) {
    throw new Error(
      `Post ${post.id} (${post.slug}) is missing required ACF fields (content_lang or parent_pillar)`
    );
  }

  return post;
}

/**
 * Gets related posts by pillar (excluding current post)
 * @param locale - The locale to filter by
 * @param pillarId - The parent pillar ID
 * @param excludeId - Post ID to exclude (current post)
 * @param limit - Number of related posts to return (default 2)
 */
export async function getRelatedPosts(
  locale: Locale,
  pillarId: number,
  excludeId: number,
  limit: number = 2
): Promise<BlogPost[]> {
  if (!isValidLocale(locale)) {
    throw new Error(`Invalid locale: ${locale}`);
  }

  if (!pillarId || typeof pillarId !== "number") {
    throw new Error(`Invalid pillarId: ${pillarId}`);
  }

  if (!excludeId || typeof excludeId !== "number") {
    throw new Error(`Invalid excludeId: ${excludeId}`);
  }

  // Fetch posts with minimal fields for related posts display
  const fields = ["id", "slug", "title", "date", "excerpt", "link", "acf"];

  const params = new URLSearchParams({
    per_page: (limit + 5).toString(), // Fetch extra to account for filtering
    acf_format: "standard",
    status: "publish",
    _fields: fields.join(","),
  });

  const key = `related-${pillarId}-${excludeId}-${locale}-${limit}`;
  const allPosts = await fetchDeduplicated(key, async () => {
    return fetchWpApi<BlogPost[]>(
      `/posts?${params.toString()}`,
      ["posts", `posts-pillar-${pillarId}`, `posts-${locale}`]
    );
  });

  // Filter by pillar, locale, exclude current post, and validate ACF structure
  const filtered = allPosts
    .filter((post) => {
      if (!hasValidAcfStructure(post)) {
        return false;
      }
    const postPillarId = getParentPillarId(post);
      const contentLang = post.acf?.blog_post?.header?.content_lang;
      return (
        post.id !== excludeId &&
        postPillarId === pillarId &&
        contentLang === locale
      );
    })
    .slice(0, limit);

  return filtered;
}

/**
 * Gets pillar post details by ID
 * @param pillarId - The pillar post ID
 */
export async function getPillarById(
  pillarId: number
): Promise<PillarPost | null> {
  if (!pillarId || typeof pillarId !== "number") {
    throw new Error(`Invalid pillarId: ${pillarId}`);
  }

  const params = new URLSearchParams({
    include: pillarId.toString(),
    acf_format: "standard",
    _fields: "id,slug,title,link,acf",
  });

  const key = `pillar-${pillarId}`;
  const pillars = await fetchDeduplicated(key, async () => {
    return fetchWpApi<PillarPost[]>(
      `/pillar?${params.toString()}`,
      ["pillars", `pillar-${pillarId}`]
    );
  });

  return pillars.length > 0 ? pillars[0] : null;
}

/**
 * Gets pillar post details by slug
 * @param slug - The pillar post slug
 */
export async function getPillarBySlug(
  slug: string
): Promise<PillarPost | null> {
  if (!slug || typeof slug !== "string") {
    throw new Error(`Invalid slug: ${slug}`);
  }

  const params = new URLSearchParams({
    slug,
    acf_format: "standard",
    _fields: "id,slug,title,link,acf",
  });

  const key = `pillar-slug-${slug}`;
  const pillars = await fetchDeduplicated(key, async () => {
    return fetchWpApi<PillarPost[]>(
      `/pillar?${params.toString()}`,
      ["pillars", `pillar-slug-${slug}`]
    );
  });

  return pillars.length > 0 ? pillars[0] : null;
}

/**
 * Single post page data structure
 */
export interface SinglePostPageData {
  post: BlogPost;
  pillar: PillarPost | null;
  relatedPosts: BlogPost[];
}

/**
 * Gets complete data for a single post page (post, pillar, and related posts)
 * Fetches pillar and related posts in parallel for optimal performance
 * @param locale - The locale to filter by
 * @param slug - The post slug
 * @returns Complete post page data or null if post not found
 */
export async function getSinglePostPageData(
  locale: Locale,
  slug: string
): Promise<SinglePostPageData | null> {
  const post = await getPostBySlug(locale, slug);

  if (!post) {
    return null;
  }

  const pillarId = getParentPillarId(post);
  if (!pillarId) {
    throw new Error(
      `Post ${post.id} (${post.slug}) is missing parent_pillar in ACF`
    );
  }

  // Fetch pillar and related posts in parallel
  const [pillar, relatedPosts] = await Promise.all([
    getPillarById(pillarId),
    getRelatedPosts(locale, pillarId, post.id, 2),
  ]);

  return {
    post,
    pillar,
    relatedPosts,
  };
}
