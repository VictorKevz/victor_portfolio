import { generateHumansTxt } from "@/lib/generators/humans";

export async function GET() {
  const humans = generateHumansTxt();

  return new Response(humans, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}

