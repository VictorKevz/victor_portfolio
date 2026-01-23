import { generateLlmsTxt } from "@/lib/generators/llms";
import { defaultLocale } from "@/lib/i18n/config";

export async function GET() {
  const llms = await generateLlmsTxt(defaultLocale);

  return new Response(llms, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}

