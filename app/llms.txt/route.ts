import { generateLlmsTxt } from "@/lib/generators/llms";
import { defaultLocale, isValidLocale, type Locale } from "@/lib/i18n/config";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang");
  const locale: Locale = lang && isValidLocale(lang) ? lang : defaultLocale;
  const llms = await generateLlmsTxt(locale);

  return new Response(llms, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}

