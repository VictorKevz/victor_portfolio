import { generateHumansTxt } from "@/lib/generators/humans";
import { defaultLocale } from "@/lib/i18n/config";

export async function GET() {
  const humans = generateHumansTxt(defaultLocale);

  return new Response(humans, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}

