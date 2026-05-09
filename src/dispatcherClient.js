const TASK_CACHE_PREFIX = "bridge:dispatcher:tasks:v1";

function scopeKey(dispatcher = {}) {
  return [
    dispatcher.teamId || "estate-agent-uk",
    dispatcher.useCaseId || "branch-operations",
    dispatcher.coordinatorBusAddress || "estate-agent.uk.case",
  ]
    .map((part) => encodeURIComponent(part))
    .join(":");
}

function taskCacheKey(dispatcher = {}) {
  return `${TASK_CACHE_PREFIX}:${scopeKey(dispatcher)}`;
}

export function readCachedTasks(dispatcher = {}) {
  if (typeof window === "undefined") return [];
  try {
    const cached = window.localStorage.getItem(taskCacheKey(dispatcher));
    if (!cached) return [];
    const parsed = JSON.parse(cached);
    return Array.isArray(parsed?.tasks) ? parsed.tasks : [];
  } catch {
    return [];
  }
}

export function cacheTasks(dispatcher = {}, tasks) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(taskCacheKey(dispatcher), JSON.stringify({ cachedAt: new Date().toISOString(), tasks }));
  } catch {
    // Cache is best-effort only.
  }
}

export async function fetchBridgeTasks(dispatcher = {}) {
  const base = dispatcher.proxyBase || "/bridge-api";
  const params = new URLSearchParams({
    team_id: dispatcher.teamId || "estate-agent-uk",
    use_case_id: dispatcher.useCaseId || "branch-operations",
    limit: String(dispatcher.limit || 75),
  });
  const response = await fetch(`${base}/tasks?${params.toString()}`, {
    headers: { accept: "application/json" },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || `Task API ${response.status}`);
  const tasks = Array.isArray(payload.tasks) ? payload.tasks : [];
  cacheTasks(dispatcher, tasks);
  return tasks;
}

export async function submitBridgeTask(dispatcher = {}, task) {
  const base = dispatcher.proxyBase || "/bridge-api";
  const response = await fetch(`${base}/tasks`, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      team_id: dispatcher.teamId || "estate-agent-uk",
      use_case_id: dispatcher.useCaseId || "branch-operations",
      to_agent: dispatcher.coordinatorBusAddress || "estate-agent.uk.case",
      ...task,
    }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || `Task API ${response.status}`);
  return payload;
}

export function stageForTask(task) {
  if (task?.status === "blocked") return "blocked";
  if (task?.status === "resolved" || task?.status === "superseded") return "done";
  if (task?.status === "acknowledged" || task?.status === "in_progress") return "live";
  if (task?.from_agent && task.from_agent !== "dashboard.local") return "prep";
  return "intake";
}

export function ageLabel(iso) {
  if (!iso) return "";
  const seconds = Math.max(0, Math.floor((Date.now() - Date.parse(iso)) / 1000));
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 48) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}
