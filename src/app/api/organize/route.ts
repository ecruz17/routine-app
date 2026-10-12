/**
 * Server-side proxy to the organizer Lambda. It exists only to keep the API
 * key out of the browser: it validates the body, adds `x-api-key`, and
 * forwards the backend's response unchanged. Configure with ROUTINE_API_URL
 * and ROUTINE_API_KEY (server-only env vars, never NEXT_PUBLIC_).
 */
import { organizeRequestSchema, type OrganizeProxyError } from "@/lib/ai-contract";

// Slightly below the client's 20 s timeout so the client gets a clear 504.
const UPSTREAM_TIMEOUT_MS = 19_000;

const errorResponse = (error: OrganizeProxyError, status: number) => Response.json({ error }, { status });

export async function POST(request: Request) {
  const url = process.env.ROUTINE_API_URL;
  const apiKey = process.env.ROUTINE_API_KEY;
  if (!url || !apiKey) {
    console.error("Organizer proxy is not configured: set ROUTINE_API_URL and ROUTINE_API_KEY.");
    return errorResponse("not_configured", 500);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("invalid_request", 400);
  }
  const parsed = organizeRequestSchema.safeParse(body);
  if (!parsed.success) return errorResponse("invalid_request", 400);

  let upstream: Response;
  try {
    upstream = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey },
      body: JSON.stringify(parsed.data),
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
  } catch (error) {
    const timedOut = error instanceof DOMException && error.name === "TimeoutError";
    if (!timedOut) console.error("Organizer request failed.", error);
    return errorResponse(timedOut ? "timeout" : "upstream_error", timedOut ? 504 : 502);
  }

  if (upstream.status === 429) return errorResponse("rate_limited", 429);
  if (!upstream.ok) {
    console.error(`Organizer responded with HTTP ${upstream.status}.`);
    return errorResponse("upstream_error", 502);
  }

  // Pass the body through untouched; the client validates and maps it.
  return new Response(await upstream.text(), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
