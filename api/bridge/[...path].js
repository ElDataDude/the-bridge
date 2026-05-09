const DEFAULT_DISPATCHER_URL = "https://bridge.patchworks.ai";

export default async function handler(request, response) {
  const dashboardToken = process.env.BRIDGE_DASHBOARD_TOKEN;
  if (!dashboardToken) {
    response.status(500).json({ error: "BRIDGE_DASHBOARD_TOKEN is not configured" });
    return;
  }

  const dispatcherUrl = process.env.BRIDGE_DISPATCHER_URL || DEFAULT_DISPATCHER_URL;
  const incomingUrl = new URL(request.url, "http://localhost");
  const bridgePath = incomingUrl.pathname.replace(/^\/api\/bridge/, "") || "/";
  const targetUrl = new URL(`/api${bridgePath}${incomingUrl.search}`, dispatcherUrl);
  const headers = forwardedHeaders(request.headers, dashboardToken);
  const body = request.method === "GET" || request.method === "HEAD" ? undefined : await readBody(request);
  const upstream = await fetch(targetUrl, {
    method: request.method,
    headers,
    body,
    redirect: "manual",
  });

  response.status(upstream.status);
  upstream.headers.forEach((value, key) => {
    if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) response.setHeader(key, value);
  });
  response.send(Buffer.from(await upstream.arrayBuffer()));
}

const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "content-encoding",
  "content-length",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);

function forwardedHeaders(headers, dashboardToken) {
  const next = {};
  for (const [key, value] of Object.entries(headers)) {
    const lower = key.toLowerCase();
    if (HOP_BY_HOP_HEADERS.has(lower) || lower === "host" || lower === "authorization") continue;
    if (Array.isArray(value)) next[key] = value.join(", ");
    else if (value !== undefined) next[key] = String(value);
  }
  next.authorization = `Bearer ${dashboardToken}`;
  next.accept = next.accept || "application/json";
  return next;
}

async function readBody(request) {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return chunks.length ? Buffer.concat(chunks) : undefined;
}
