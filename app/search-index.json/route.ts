import { buildSearchIndex } from "@/lib/search-index-build";

export const dynamic = "force-static";

export function GET() {
  return Response.json(buildSearchIndex());
}
