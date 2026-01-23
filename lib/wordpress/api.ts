import { HomePageData } from "./types";

/**
 * Fetches data from WordPress REST API endpoint
 * @param endpoint - The WordPress REST API endpoint URL
 * @param tags - Optional cache tags for on-demand revalidation
 * @returns Promise with the fetched data
 */
async function fetchWpData(
  endpoint: string,
  tags: string[] = []
): Promise<HomePageData> {
  const response = await fetch(endpoint, {
    next: {
      tags: ["wordpress", ...tags],
    },
    cache: "force-cache",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch WP data: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  return data;
}

/**
 * Fetches home page data from WordPress for the specified locale
 * @param locale - The locale ('en' or 'fi')
 * @returns Promise with the home page data
 * @throws Error if endpoint is not configured or API call fails
 */
export async function getHomePageData(
  locale: "en" | "fi"
): Promise<HomePageData> {
  if (!locale || typeof locale !== 'string') {
    throw new Error(
      `Invalid locale provided: ${locale}. Locale must be 'en' or 'fi'.`
    );
  }

  const envKey = `WP_HOME_${locale.toUpperCase()}_ENDPOINT`;
  const endpoint = process.env[envKey];

  if (!endpoint) {
    throw new Error(
      `WordPress endpoint not configured for locale: ${locale}. Please set ${envKey} in .env`
    );
  }

  try {
    return await fetchWpData(endpoint, ["homepage", `homepage-${locale}`]);
  } catch (error) {
    throw new Error(
      `Failed to fetch home page data for ${locale}: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
