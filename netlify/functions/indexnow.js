// netlify/functions/indexnow.js
// -----------------------------------------------------------------------------
// Vidforges — Serverless relay for IndexNow pings
// Spec (simplified): https://www.indexnow.org/documentation
//
// Accepts POST JSON:
//   {
//     "urls": ["https://vidforges.com/", "https://vidforges.com/fr/"]
//     // OR "urlList": [...]
//     // Optional overrides (otherwise we infer):
//     "key": "30013c1aaf39462fb4dae8e0518d9842",
//     "keyLocation": "https://vidforges.com/30013c1aaf39462fb4dae8e0518d9842.txt"
//   }
//
// Responds 200 with per-endpoint status codes.
// CORS: allows same-origin and simple cross-origin POST.
// -----------------------------------------------------------------------------

const DEFAULT_SITE = "https://vidforges.com";
const DEFAULT_KEY = process.env.INDEXNOW_KEY || "30013c1aaf39462fb4dae8e0518d9842";
const DEFAULT_KEY_LOCATION =
  process.env.INDEXNOW_KEY_LOCATION || `${DEFAULT_SITE}/${DEFAULT_KEY}.txt`;

// Conservative set of IndexNow endpoints. `api.indexnow.org` should fan out.
const ENDPOINTS = [
  "https://api.indexnow.org/indexnow",
  "https://www.bing.com/indexnow",
  // Additional endpoints can be enabled as reliability improves:
  // "https://search.seznam.cz/indexnow",
  // "https://yandex.com/indexnow"
];

exports.handler = async (event) => {
  // --- CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: corsHeaders(),
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return json(
      405,
      { error: "Method Not Allowed. Use POST with a JSON body." },
      { Allow: "POST, OPTIONS" }
    );
  }

  let payload;
  try {
    payload = event.body ? JSON.parse(event.body) : {};
  } catch {
    return json(400, { error: "Invalid JSON body." });
  }

  // Accept either `urls` or `urlList`
  const urls = toArray(payload.urls || payload.urlList).filter(Boolean);

  if (!urls.length) {
    return json(400, { error: "Missing 'urls' (array of absolute URLs) in request body." });
  }

  // Infer host from first URL if possible
  let host = "";
  try {
    host = new URL(urls[0]).host;
  } catch {
    // ignore; IndexNow gateway accepts urlList without host as well
  }

  // Key & keyLocation (defaults provided)
  const key = String(payload.key || DEFAULT_KEY);
  const keyLocation = String(payload.keyLocation || DEFAULT_KEY_LOCATION);

  // Build the IndexNow POST payload (spec allows either 'urlList' or 'urls')
  const indexnowBody = {
    host,
    key,
    keyLocation,
    urlList: urls,
  };

  // Fire all requests in parallel, capture status
  const results = {};
  await Promise.all(
    ENDPOINTS.map(async (ep) => {
      try {
        const res = await fetch(ep, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(indexnowBody),
        });
        const text = await res.text().catch(() => "");
        results[ep] = {
          ok: res.ok,
          status: res.status,
          statusText: res.statusText,
          body: text.slice(0, 5000), // cap to avoid huge responses
        };
      } catch (e) {
        results[ep] = { ok: false, error: String(e && e.message ? e.message : e) };
      }
    })
  );

  return json(200, {
    received: {
      urls,
      keyUsed: maskKey(key),
      keyLocation,
      host,
    },
    results,
    note:
      "IndexNow pings relayed. Check 'results' per endpoint. Non-200s may still be retried later by search engines.",
  });
};

// -----------------------------
// Helpers
// -----------------------------
function toArray(v) {
  return Array.isArray(v) ? v : v ? [v] : [];
}

function maskKey(k) {
  if (!k || k.length < 8) return k || "";
  return `${k.slice(0, 6)}…${k.slice(-4)}`;
}

function corsHeaders(extra = {}) {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    ...extra,
  };
}

function json(statusCode, obj, extraHeaders = {}) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders(extraHeaders),
    },
    body: JSON.stringify(obj),
  };
}
