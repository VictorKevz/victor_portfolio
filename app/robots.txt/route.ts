import { generateRobotsTxt } from "@/lib/generators/robots";

export async function GET() {
  const robots = generateRobotsTxt();

  return new Response(robots, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}

