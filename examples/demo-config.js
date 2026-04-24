/**
 * THE BRIDGE: Demo Configuration — Platform Engineering Team
 *
 * A fictional but realistic configuration showing how The Bridge can be used
 * as a control room for a platform engineering team managing microservices,
 * deployments, incidents, and team objectives.
 *
 * This demonstrates all 11 panel types and the dual-mode (BUILD/OPS) pattern.
 * Replace with your own data to configure your control room.
 */

export default {
  // ============================================================================
  // SYSTEM IDENTITY
  // ============================================================================

  title: "#MISSION_CONTROL",
  subtitle: "Platform Engineering — Acme Corp",

  // ============================================================================
  // ENTITIES (18 services across 4 tiers)
  // ============================================================================

  entities: [
    // TIER 0 — Core Platform
    {
      id: "api-gateway",
      name: "API Gateway",
      tier: "T0",
      role: "Ingress",
      status: "active",
      health: "G",
      icon: "🌐",
      description: "Edge proxy handling all inbound traffic. Rate limiting, auth, routing.",
      connections: ["auth-service", "user-service", "billing-service", "notification-service"],
    },
    {
      id: "event-bus",
      name: "Event Bus",
      tier: "T0",
      role: "Backbone",
      status: "active",
      health: "G",
      icon: "⚡",
      description: "Kafka cluster. 12 topics, 3 consumer groups, 99.97% uptime.",
      busMessages: 2340000,
    },
    {
      id: "control-plane",
      name: "Control Plane",
      tier: "T0",
      role: "Orchestrator",
      status: "active",
      health: "G",
      icon: "⬢",
      description: "Kubernetes control plane. 3 clusters, 47 namespaces.",
    },

    // TIER 1 — Business Services
    {
      id: "auth-service",
      name: "Auth Service",
      tier: "T1",
      role: "Identity",
      status: "active",
      health: "G",
      icon: "🔐",
      description: "OAuth2/OIDC. 14k active sessions. JWT issuance, RBAC enforcement.",
    },
    {
      id: "user-service",
      name: "User Service",
      tier: "T1",
      role: "Domain",
      status: "active",
      health: "G",
      icon: "👤",
      description: "User profiles, preferences, org membership. 52k MAU.",
    },
    {
      id: "billing-service",
      name: "Billing Service",
      tier: "T1",
      role: "Domain",
      status: "active",
      health: "A",
      icon: "💳",
      description: "Stripe integration, invoicing, usage metering. MRR $340k.",
    },
    {
      id: "notification-service",
      name: "Notification Service",
      tier: "T1",
      role: "Domain",
      status: "active",
      health: "G",
      icon: "🔔",
      description: "Email, push, SMS, in-app. 180k messages/day.",
    },
    {
      id: "search-service",
      name: "Search Service",
      tier: "T1",
      role: "Domain",
      status: "active",
      health: "Gr",
      icon: "🔍",
      description: "Elasticsearch cluster. Full-text + vector search. Index lag 12s.",
    },

    // TIER 2 — Support Services
    {
      id: "media-service",
      name: "Media Service",
      tier: "T2",
      role: "Support",
      status: "active",
      health: "G",
      icon: "📸",
      description: "Image/video processing pipeline. S3 + CloudFront CDN.",
    },
    {
      id: "analytics-pipeline",
      name: "Analytics Pipeline",
      tier: "T2",
      role: "Data",
      status: "active",
      health: "G",
      icon: "📊",
      description: "Clickstream → Kafka → Spark → Redshift. 4h SLA.",
    },
    {
      id: "ml-inference",
      name: "ML Inference",
      tier: "T2",
      role: "Intelligence",
      status: "staged",
      health: "A",
      icon: "🧠",
      description: "Recommendation engine. SageMaker endpoints. A/B framework.",
      dimmed: true,
    },
    {
      id: "export-service",
      name: "Export Service",
      tier: "T2",
      role: "Support",
      status: "active",
      health: "G",
      icon: "📤",
      description: "CSV/PDF report generation. Queue-based, async.",
    },

    // TIER 3 — Infrastructure
    {
      id: "ci-cd",
      name: "CI/CD Pipeline",
      tier: "T3",
      role: "Delivery",
      status: "active",
      health: "G",
      icon: "🚀",
      description: "GitHub Actions → ArgoCD. 23 pipelines, 94% green.",
    },
    {
      id: "observability",
      name: "Observability Stack",
      tier: "T3",
      role: "Monitoring",
      status: "active",
      health: "G",
      icon: "👁",
      description: "Datadog + PagerDuty + Sentry. 340 monitors, 12 SLOs.",
    },
    {
      id: "secret-manager",
      name: "Secret Manager",
      tier: "T3",
      role: "Security",
      status: "active",
      health: "G",
      icon: "🔒",
      description: "Vault cluster. Auto-rotation on 90-day policy.",
    },
    {
      id: "feature-flags",
      name: "Feature Flags",
      tier: "T3",
      role: "Release",
      status: "active",
      health: "G",
      icon: "🚩",
      description: "LaunchDarkly. 67 active flags, 12 stale (>90 days).",
    },

    // TIER 4 — Guardians
    {
      id: "security-scanner",
      name: "Security Scanner",
      tier: "T4",
      role: "Guardian",
      status: "active",
      health: "A",
      icon: "🛡",
      description: "Snyk + Dependabot. 3 critical CVEs open, 14 high.",
    },
    {
      id: "cost-watcher",
      name: "Cost Watcher",
      tier: "T4",
      role: "Guardian",
      status: "active",
      health: "Gr",
      icon: "💰",
      description: "AWS cost anomaly detection. Monthly burn $47k, trending +8%.",
    },
  ],

  // ============================================================================
  // OBJECTIVES
  // ============================================================================

  objectives: [
    {
      id: "reliability",
      name: "Reliability",
      description: "99.95% platform uptime across all Tier 0-1 services",
      health: "G",
      progress: 82,
      quadrant: "Platform",
      risks: [
        "Billing service latency spikes during invoice batch",
        "Event bus partition rebalance causing consumer lag",
      ],
      wins: [
        "Zero Sev-1 incidents in March",
        "API Gateway p99 latency down to 45ms",
      ],
    },
    {
      id: "velocity",
      name: "Velocity",
      description: "Ship features weekly, deploy daily, rollback in <5 min",
      health: "Gr",
      progress: 68,
      quadrant: "Delivery",
      risks: [
        "Feature flag cleanup backlog growing",
        "Test coverage below 80% on 3 services",
      ],
      wins: [
        "Mean deploy frequency: 4.2/day",
        "Rollback automation complete",
      ],
    },
    {
      id: "security",
      name: "Security",
      description: "Zero critical CVEs open >7 days, SOC2 audit ready",
      health: "A",
      progress: 55,
      quadrant: "Trust",
      risks: [
        "3 critical CVEs in transitive dependencies",
        "SOC2 evidence collection 40% complete",
      ],
      wins: [
        "Secret rotation automated",
        "RBAC audit completed across all services",
      ],
    },
    {
      id: "cost",
      name: "Cost Efficiency",
      description: "Reduce AWS spend by 15% QoQ while scaling to 100k MAU",
      health: "A",
      progress: 30,
      quadrant: "Platform",
      risks: [
        "ML inference endpoints over-provisioned",
        "Dev environment costs uncapped",
      ],
      wins: [
        "Reserved instances saved $4k/mo",
        "Spot fleet adopted for batch processing",
      ],
    },
    {
      id: "dx",
      name: "Developer Experience",
      description: "New engineer productive in <1 week, inner loop <30s",
      health: "Gr",
      progress: 72,
      quadrant: "Delivery",
      risks: [
        "Local dev setup still requires 14 manual steps",
      ],
      wins: [
        "Dev container templates shipped",
        "Service scaffold CLI released",
      ],
    },
  ],

  // ============================================================================
  // KANBAN COLUMNS
  // ============================================================================

  kanbanColumns: [
    { id: "icebox", name: "Icebox", color: "#999" },
    { id: "refinement", name: "Refinement", color: "#4A90E2" },
    { id: "ready", name: "Ready", color: "#F5A623" },
    { id: "in-progress", name: "In Progress", color: "#7ED321" },
    { id: "review", name: "Review", color: "#9013FE" },
    { id: "staging", name: "Staging", color: "#50E3C2" },
    { id: "shipped", name: "Shipped", color: "#417505" },
  ],

  // ============================================================================
  // BACKLOG
  // ============================================================================

  backlog: [
    {
      id: "billing-latency",
      title: "Fix Billing Batch Latency",
      description: "Invoice generation causing p99 spikes to 2.3s during nightly batch",
      column: "in-progress",
      priority: "critical",
      assignee: "billing-service",
      due: "2026-04-22",
      kso: "reliability",
    },
    {
      id: "kafka-rebalance",
      title: "Kafka Rebalance Mitigation",
      description: "Implement cooperative sticky assignor to reduce consumer lag during rebalance",
      column: "in-progress",
      priority: "critical",
      assignee: "event-bus",
      due: "2026-04-21",
      kso: "reliability",
    },
    {
      id: "snyk-criticals",
      title: "Resolve Critical CVEs",
      description: "3 critical vulnerabilities in jackson-databind, log4j-api, and spring-web",
      column: "in-progress",
      priority: "critical",
      assignee: "security-scanner",
      due: "2026-04-19",
      kso: "security",
    },
    {
      id: "soc2-evidence",
      title: "SOC2 Evidence Pack — Access Controls",
      description: "Document RBAC policies, access reviews, and provisioning workflows",
      column: "review",
      priority: "high",
      assignee: "auth-service",
      due: "2026-04-25",
      kso: "security",
    },
    {
      id: "ml-rightsizing",
      title: "ML Endpoint Rightsizing",
      description: "Scale down SageMaker endpoints based on actual inference traffic patterns",
      column: "ready",
      priority: "high",
      assignee: "ml-inference",
      kso: "cost",
    },
    {
      id: "dev-env-caps",
      title: "Dev Environment Cost Caps",
      description: "Implement auto-shutdown for idle dev clusters after 2h",
      column: "ready",
      priority: "high",
      assignee: "cost-watcher",
      kso: "cost",
    },
    {
      id: "local-dev-setup",
      title: "One-Command Local Dev",
      description: "Replace 14-step manual setup with docker compose + seed script",
      column: "in-progress",
      priority: "high",
      assignee: "ci-cd",
      due: "2026-04-28",
      kso: "dx",
    },
    {
      id: "feature-flag-cleanup",
      title: "Stale Feature Flag Cleanup",
      description: "Remove 12 flags older than 90 days, verify no runtime dependencies",
      column: "refinement",
      priority: "normal",
      assignee: "feature-flags",
      kso: "velocity",
    },
    {
      id: "vector-search-v2",
      title: "Vector Search v2 — Hybrid Retrieval",
      description: "Combine BM25 + vector similarity for improved relevance",
      column: "refinement",
      priority: "normal",
      assignee: "search-service",
      kso: "velocity",
    },
    {
      id: "test-coverage-push",
      title: "Test Coverage >80% Push",
      description: "Add integration tests for billing, notification, and export services",
      column: "ready",
      priority: "normal",
      assignee: "ci-cd",
      kso: "velocity",
    },
    {
      id: "cdn-cache-strategy",
      title: "CDN Cache Strategy Overhaul",
      description: "Implement stale-while-revalidate and cache tagging for media assets",
      column: "icebox",
      priority: "normal",
      assignee: "media-service",
      kso: "reliability",
    },
    {
      id: "api-versioning",
      title: "API Versioning Strategy",
      description: "Implement header-based versioning with sunset policy",
      column: "icebox",
      priority: "low",
      assignee: "api-gateway",
      kso: "dx",
    },
    {
      id: "slo-dashboards",
      title: "SLO Burn Rate Dashboards",
      description: "Multi-window burn rate alerting for all 12 SLOs",
      column: "staging",
      priority: "normal",
      assignee: "observability",
      kso: "reliability",
    },
    {
      id: "export-streaming",
      title: "Streaming Export for Large Datasets",
      description: "Replace batch CSV generation with streaming for >100k row exports",
      column: "shipped",
      priority: "normal",
      assignee: "export-service",
      kso: "velocity",
    },
    {
      id: "secret-rotation-audit",
      title: "Secret Rotation Audit Trail",
      description: "Log all rotation events to immutable audit store for SOC2",
      column: "shipped",
      priority: "high",
      assignee: "secret-manager",
      kso: "security",
    },
  ],

  // ============================================================================
  // TASKS (Team operational tasks)
  // ============================================================================

  tasks: [
    {
      id: "oncall-handover",
      title: "On-Call Handover",
      description: "Weekly on-call rotation handover — document open incidents and runbooks",
      due: "2026-04-21",
      priority: "high",
      category: "ops",
      assignee: "Platform Team",
    },
    {
      id: "architecture-review",
      title: "Architecture Review — ML Pipeline",
      description: "Review SageMaker endpoint architecture before scaling decision",
      due: "2026-04-23",
      priority: "high",
      category: "review",
      assignee: "Tech Lead",
    },
    {
      id: "quarterly-retro",
      title: "Q1 Reliability Retrospective",
      description: "Review SLO performance, incident trends, and capacity plan",
      due: "2026-04-24",
      priority: "normal",
      category: "process",
      assignee: "Engineering Manager",
    },
    {
      id: "vendor-renewal",
      title: "Datadog Contract Renewal",
      description: "Annual renewal negotiation — usage grew 40%, need volume discount",
      due: "2026-04-30",
      priority: "high",
      category: "admin",
      assignee: "Engineering Manager",
    },
    {
      id: "new-hire-onboarding",
      title: "Onboard New SRE (Sarah)",
      description: "Week 1 checklist: access, dev setup, shadow on-call, first PR",
      due: "2026-04-22",
      priority: "normal",
      category: "people",
      assignee: "Tech Lead",
    },
    {
      id: "incident-review",
      title: "Incident Review — April 14 Kafka Outage",
      description: "Blameless post-mortem, action items, timeline reconstruction",
      due: "2026-04-21",
      priority: "high",
      category: "ops",
      assignee: "SRE Team",
    },
    {
      id: "capacity-forecast",
      title: "May Capacity Forecast",
      description: "Project compute needs for marketing campaign traffic spike",
      due: "2026-04-25",
      priority: "normal",
      category: "planning",
      assignee: "SRE Team",
    },
    {
      id: "runbook-update",
      title: "Update Billing Service Runbook",
      description: "Add steps for invoice batch recovery and Stripe webhook replay",
      due: "2026-04-22",
      priority: "normal",
      category: "docs",
      assignee: "Platform Team",
    },
  ],

  // ============================================================================
  // CAPABILITIES
  // ============================================================================

  capabilities: [
    // Reliability
    { id: "c1", code: "R1", name: "Multi-region failover", category: "Reliability" },
    { id: "c2", code: "R2", name: "Circuit breaker on all service calls", category: "Reliability" },
    { id: "c3", code: "R3", name: "SLO-based alerting", category: "Reliability" },
    { id: "c4", code: "R4", name: "Automated rollback on deploy failure", category: "Reliability" },
    { id: "c5", code: "R5", name: "Chaos engineering (Game Day)", category: "Reliability" },

    // Delivery
    { id: "c6", code: "D1", name: "Trunk-based development", category: "Delivery" },
    { id: "c7", code: "D2", name: "Continuous deployment to staging", category: "Delivery" },
    { id: "c8", code: "D3", name: "Feature flag gating", category: "Delivery" },
    { id: "c9", code: "D4", name: "Service scaffold CLI", category: "Delivery" },

    // Security
    { id: "c10", code: "S1", name: "Automated dependency scanning", category: "Security" },
    { id: "c11", code: "S2", name: "Secret rotation automation", category: "Security" },
    { id: "c12", code: "S3", name: "RBAC with least-privilege default", category: "Security" },
    { id: "c13", code: "S4", name: "SOC2 continuous compliance", category: "Security" },

    // Observability
    { id: "c14", code: "O1", name: "Distributed tracing (all services)", category: "Observability" },
    { id: "c15", code: "O2", name: "Structured logging standard", category: "Observability" },
    { id: "c16", code: "O3", name: "Cost attribution by service", category: "Observability" },
    { id: "c17", code: "O4", name: "Incident timeline reconstruction", category: "Observability" },
  ],

  // ============================================================================
  // PATTERNS
  // ============================================================================

  patterns: [
    { id: "circuit-breaker", name: "Circuit Breaker", description: "Fail-fast on downstream errors, auto-recovery with half-open state" },
    { id: "saga-pattern", name: "Saga Pattern", description: "Distributed transactions via compensating events" },
    { id: "strangler-fig", name: "Strangler Fig", description: "Incremental migration from monolith to microservices" },
    { id: "blue-green", name: "Blue-Green Deploy", description: "Zero-downtime deployment with instant rollback" },
    { id: "bulkhead", name: "Bulkhead Isolation", description: "Resource isolation prevents cascade failure" },
    { id: "sidecar", name: "Sidecar Proxy", description: "Cross-cutting concerns (auth, logging, tracing) as sidecar" },
    { id: "event-sourcing", name: "Event Sourcing", description: "Append-only event log as source of truth" },
    { id: "cqrs", name: "CQRS", description: "Separate read and write models for query optimisation" },
    { id: "backpressure", name: "Backpressure", description: "Flow control to prevent consumer overload" },
    { id: "retry-budget", name: "Retry Budget", description: "Global retry cap to prevent thundering herd" },
    { id: "canary-release", name: "Canary Release", description: "Progressive traffic shift with automated analysis" },
    { id: "cell-architecture", name: "Cell Architecture", description: "Blast radius containment via independent cells" },
  ],

  // ============================================================================
  // INTEGRATIONS
  // ============================================================================

  integrations: [
    { id: "aws", name: "AWS", icon: "☁️", status: "active" },
    { id: "datadog", name: "Datadog", icon: "📈", status: "active" },
    { id: "pagerduty", name: "PagerDuty", icon: "🚨", status: "active" },
    { id: "github", name: "GitHub", icon: "🐙", status: "active" },
    { id: "stripe", name: "Stripe", icon: "💳", status: "active" },
    { id: "launchdarkly", name: "LaunchDarkly", icon: "🚩", status: "active" },
    { id: "sentry", name: "Sentry", icon: "🐛", status: "active" },
    { id: "slack", name: "Slack", icon: "💬", status: "active" },
    { id: "jira", name: "Jira", icon: "📋", status: "active" },
    { id: "confluence", name: "Confluence", icon: "📝", status: "staged" },
  ],

  // ============================================================================
  // METRICS
  // ============================================================================

  metrics: {
    total: 1247,
    actioned: 1180,
    pending: 42,
    blocked: 8,
    resolved: 1139,
    busHealth: "G",
    avgResponseTime: "340ms",
    stallThreshold: 24,
    staleCount: 3,
  },

  // ============================================================================
  // OUTCOMES
  // ============================================================================

  outcomes: [
    { id: "reliability", name: "Reliability", quadrant: "Platform" },
    { id: "velocity", name: "Velocity", quadrant: "Delivery" },
    { id: "security", name: "Security", quadrant: "Trust" },
    { id: "cost", name: "Cost Efficiency", quadrant: "Platform" },
    { id: "dx", name: "Developer Experience", quadrant: "Delivery" },
  ],

  // ============================================================================
  // QUADRANTS
  // ============================================================================

  quadrants: [
    {
      id: "platform",
      name: "Platform",
      emoji: "🏗",
      items: ["reliability", "cost"],
      allocation: 40,
    },
    {
      id: "delivery",
      name: "Delivery",
      emoji: "🚀",
      items: ["velocity", "dx"],
      allocation: 35,
    },
    {
      id: "trust",
      name: "Trust",
      emoji: "🛡",
      items: ["security"],
      allocation: 25,
    },
  ],

  // ============================================================================
  // MODES
  // ============================================================================

  modes: [
    {
      id: "build",
      label: "BUILD",
      subtitle: "Shipping features and reducing tech debt",
      color: "#7ED321",
      tagline: "Build Crew",
      crew: [
        { letter: "TL", name: "Tech Lead", role: "Architecture & Priorities", colors: ["#7ED321", "#fff"] },
        { letter: "BE", name: "Backend", role: "Services & APIs", colors: ["#4A90E2", "#fff"] },
        { letter: "FE", name: "Frontend", role: "UI & DX", colors: ["#F5A623", "#fff"] },
        { letter: "ML", name: "ML Eng", role: "Models & Inference", colors: ["#9013FE", "#fff"] },
      ],
      tabs: [
        { id: "entities", label: "Services", panel: "EntityGrid" },
        { id: "kanban", label: "Sprint Board", panel: "KanbanBoard" },
        { id: "capabilities", label: "Capabilities", panel: "CapabilitiesGrid" },
        { id: "patterns", label: "Patterns", panel: "PatternsGrid" },
      ],
      stats: [
        { label: "IN FLIGHT", value: "7", color: "#7ED321" },
        { label: "IN REVIEW", value: "2", color: "#9013FE" },
        { label: "SHIPPED (Q2)", value: "14", color: "#50E3C2" },
        { label: "VELOCITY", value: "4.2/day", color: "#4A90E2" },
        { label: "COVERAGE", value: "78%", color: "#F5A623" },
      ],
    },
    {
      id: "ops",
      label: "OPS",
      subtitle: "Keeping the lights on and the costs down",
      color: "#4A90E2",
      tagline: "Operations Crew",
      crew: [
        { letter: "EM", name: "Eng Manager", role: "People & Process", colors: ["#4A90E2", "#fff"] },
        { letter: "SR", name: "SRE", role: "Reliability & Incidents", colors: ["#D0021B", "#fff"] },
        { letter: "SC", name: "SecOps", role: "Security & Compliance", colors: ["#F8E71C", "#333"] },
        { letter: "FN", name: "FinOps", role: "Cost & Capacity", colors: ["#50E3C2", "#333"] },
      ],
      tabs: [
        { id: "objectives", label: "Objectives", panel: "ObjectiveStack" },
        { id: "tasks", label: "Task Board", panel: "TaskBoard" },
        { id: "integrations", label: "Integrations", panel: "IntegrationsGrid" },
        { id: "metrics", label: "Metrics", panel: "MetricsPanel" },
        { id: "outcomes", label: "Outcomes", panel: "OutcomeGrid" },
        { id: "balance", label: "Balance", panel: "QuadrantBalance" },
        { id: "drift", label: "Drift", panel: "DriftDetection" },
      ],
      stats: [
        { label: "UPTIME", value: "99.97%", color: "#7ED321" },
        { label: "OPEN INCIDENTS", value: "1", color: "#F5A623" },
        { label: "CRITICAL CVEs", value: "3", color: "#D0021B" },
        { label: "AWS BURN", value: "$47k/mo", color: "#F5A623" },
        { label: "ON-CALL", value: "Sarah K.", color: "#4A90E2" },
      ],
    },
  ],

  // ============================================================================
  // FOOTER
  // ============================================================================

  footer: {
    left: "Mission Control — Acme Corp Platform Engineering",
    indicators: [
      { label: "Production", status: "active" },
      { label: "Staging", status: "active" },
      { label: "ML Endpoints", status: "staged" },
    ],
    right: "v0.1.0",
  },

  // ============================================================================
  // ACTIONS
  // ============================================================================

  actionLabel: "Open Runbook",

  getStarterPrompt(item) {
    return `You are reviewing: ${item?.name || item?.title || "an item"} in the Acme Corp platform engineering control room. What would you like to do?`;
  },

  onAction(item) {
    console.log("Action triggered:", item?.name || item?.title);
  },
};
