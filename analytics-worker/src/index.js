const allowedOrigins = new Set([
  "https://suportewcorp.github.io",
  "http://localhost:8000",
  "http://127.0.0.1:8000"
]);

const allowedEvents = new Set([
  "CARD_CLICK",
  "SEARCH",
  "ASSISTANT_CONTENT_CLICK",
  "GUIDE_OPEN"
]);

const maxPayloadBytes = 2048;
const popularPeriodDays = 30;
const popularLimit = 6;

function corsHeaders(origin) {
  const allowedOrigin = allowedOrigins.has(origin)
    ? origin
    : "https://suportewcorp.github.io";

  return {
    "access-control-allow-origin": allowedOrigin,
    "access-control-allow-methods": "GET, POST, OPTIONS",
    "access-control-allow-headers": "content-type",
    "access-control-max-age": "86400",
    "vary": "Origin"
  };
}

function jsonResponse(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders(origin),
      "content-type": "application/json; charset=utf-8"
    }
  });
}

function cleanString(value, maxLength) {
  if (typeof value !== "string") return null;

  const cleaned = value
    .replace(/[<>{}\[\]]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);

  return cleaned || null;
}

function cleanInteger(value, min, max) {
  if (!Number.isInteger(value)) return null;
  if (value < min || value > max) return null;
  return value;
}

function validatePayload(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return null;
  }

  const event = cleanString(input.event, 40);
  if (!allowedEvents.has(event)) return null;

  const payload = {
    event,
    content_id: cleanString(input.content_id, 96),
    type: cleanString(input.type, 40),
    source: cleanString(input.source, 40),
    path: cleanString(input.path, 180),
    position: cleanInteger(input.position, 1, 20),
    result_count: cleanInteger(input.result_count, 0, 500),
    has_results: typeof input.has_results === "boolean"
      ? input.has_results
      : null
  };

  if (
    (event === "CARD_CLICK" || event === "GUIDE_OPEN") &&
    (!payload.content_id || !payload.type || !payload.source || !payload.path)
  ) {
    return null;
  }

  if (event === "GUIDE_OPEN" && payload.type !== "guia") {
    return null;
  }

  if (
    event === "SEARCH" &&
    (payload.result_count === null || payload.has_results === null)
  ) {
    return null;
  }

  if (
    event === "ASSISTANT_CONTENT_CLICK" &&
    (!payload.content_id || !payload.type || payload.position === null)
  ) {
    return null;
  }

  return payload;
}

async function readPayload(request) {
  const contentLength = Number(request.headers.get("content-length") || "0");
  if (contentLength > maxPayloadBytes) return null;

  const text = await request.text();
  if (new TextEncoder().encode(text).length > maxPayloadBytes) return null;

  try {
    return JSON.parse(text);
  } catch (_error) {
    return null;
  }
}

function validatePopularRequest(url) {
  const allowedParams = new Set(["type", "limit"]);
  for (const key of url.searchParams.keys()) {
    if (!allowedParams.has(key)) return null;
  }

  if (url.searchParams.get("type") !== "guia") return null;

  const limit = url.searchParams.get("limit");
  if (limit !== null) {
    const value = Number(limit);
    if (!Number.isInteger(value) || value < 1 || value > popularLimit) return null;
  }

  return { type: "guia" };
}

async function popularResponse(env, origin, url) {
  const params = validatePopularRequest(url);
  if (!params) return jsonResponse({ ok: false }, 400, origin);

  const cutoff = new Date(Date.now() - popularPeriodDays * 24 * 60 * 60 * 1000).toISOString();
  const result = await env.ANALYTICS_DB.prepare(`
    SELECT content_id, COUNT(*) AS total
    FROM events
    WHERE event = 'GUIDE_OPEN'
      AND type = ?
      AND content_id IS NOT NULL
      AND created_at >= ?
    GROUP BY content_id
    ORDER BY total DESC, content_id ASC
  `).bind(params.type, cutoff).all();

  return jsonResponse({
    ok: true,
    period_days: popularPeriodDays,
    items: (result.results || []).map((item, index) => ({
      content_id: item.content_id,
      total: item.total,
      popular: index < popularLimit
    }))
  }, 200, origin);
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("origin") || "";
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: allowedOrigins.has(origin) ? 204 : 403,
        headers: corsHeaders(origin)
      });
    }

    if (request.method === "GET" && url.pathname === "/popular") {
      if (!allowedOrigins.has(origin) || !env.ANALYTICS_DB) {
        return jsonResponse({ ok: false }, 403, origin);
      }

      try {
        return await popularResponse(env, origin, url);
      } catch (_error) {
        return jsonResponse({ ok: false }, 500, origin);
      }
    }

    if (request.method !== "POST" || url.pathname !== "/analytics") {
      return jsonResponse({ ok: false }, 404, origin);
    }

    if (!allowedOrigins.has(origin) || !env.ANALYTICS_DB) {
      return jsonResponse({ ok: false }, 403, origin);
    }

    const payload = validatePayload(await readPayload(request));
    if (!payload) {
      return jsonResponse({ ok: false }, 400, origin);
    }

    try {
      await env.ANALYTICS_DB.prepare(`
        INSERT INTO events (
          event,
          content_id,
          type,
          source,
          path,
          position,
          result_count,
          has_results,
          created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        payload.event,
        payload.content_id,
        payload.type,
        payload.source,
        payload.path,
        payload.position,
        payload.result_count,
        payload.has_results === null ? null : Number(payload.has_results),
        new Date().toISOString()
      ).run();

      return jsonResponse({ ok: true }, 202, origin);
    } catch (_error) {
      return jsonResponse({ ok: false }, 500, origin);
    }
  }
};
