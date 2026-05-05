# THE BRIDGE

A configurable, dual-mode control room dashboard for complex systems. Pass a config object, get a control room. Built for operators — people running platform teams, agent fleets, delivery programmes, or portfolios with interconnected moving parts.

## What It Is

THE BRIDGE is a React-based dashboard that brings order to complexity. It's built for operators, not reporters—people running multi-agent systems, large programmes, or portfolios with interconnected moving parts.

Built for any system where you need:

- Real-time visibility into entity status (agents, teams, services, systems)
- Dual-mode operation (BUILD for delivery, OPS for stewardship)
- Strategic objective tracking and health monitoring
- Kanban workflow and task boards
- Decision authority matrix and risk detection

## Key Features

**Dual Mode**
- **BUILD**: Delivery crew view. Backlog, waves, skills, blocking issues.
- **OPS**: Stewardship crew view. Inbox, metrics, risks, governance.
- One-click toggle. Different tabs, stats, and crew visibility per mode.

**11 Panel Types**
- Entity Hierarchy (tier-based, sortable, searchable)
- Objective Progress (KSO tracking with risk/win backlogs)
- Kanban Board (7+ configurable columns with drag-drop)
- Task Board (personal/operational, priority-sorted)
- Bus Metrics (handoff table health, staleness, volume)
- Quadrant Balance (Heart/Body/Mind/Soul allocation)
- Pattern Library (operational and architectural patterns)
- Integration Status (external system connectivity)
- Capability Matrix (Agent/Environment/Governance capabilities)
- Mode-specific tabs (configurable per mode)
- Detail Drawers (entity drill-down, objective deep-dive)

**Health & Status**
- 6-state health indicators: G (Green), Gr (Green-ready), A (Amber), R (Red), Dim (future), None
- Status lifecycle: active, staged, planned, gap, concept, blocked, resolved
- Real-time drift detection (health regressions signal work needed)
- Entity connection topology mapping

**Entity Hierarchy**
- Multi-tier system (T0 strategic through T4 guardians)
- Role taxonomy (Principal, Orchestrator, Domain Lead, Operator, etc.)
- Surface multiplexing (PRIMARY, ACCENT, TERTIARY)
- Connection topology visualization
- Entity dimming for future/incomplete agents

**Workflow**
- Kanban with unlimited custom columns
- Drag-drop item movement with persistence
- Priority taxonomy (critical/high/normal/low)
- Item-to-objective (KSO) traceability
- Real-time filtering and search

**Decision Support**
- Authority matrix (D-sovereign/D-delegated/D-internal)
- Risk and win backlogs per objective
- Capability inventory (what's built, what's missing)
- Pattern registry (reference implementations)
- Integration inventory (what's connected)

## Quick Start

```jsx
import React from "react";
import Bridge from "@bridge/dashboard";
import { defaultTheme } from "@bridge/theme";

const MinimalConfig = {
  name: "My System",
  entities: [
    { id: "alice", name: "Alice", tier: "T0", role: "Principal", status: "active" },
    { id: "bob", name: "Bob", tier: "T1", role: "Domain Lead", status: "active" },
  ],
  objectives: [
    {
      id: "obj1",
      name: "Deliver Feature X",
      progress: 65,
      health: "Gr",
      quadrant: "Mind",
    },
  ],
  kanbanColumns: [
    { id: "backlog", name: "Backlog" },
    { id: "in-progress", name: "In Progress" },
    { id: "done", name: "Done" },
  ],
  backlog: [
    {
      id: "task1",
      title: "Build API endpoint",
      column: "in-progress",
      assignee: "alice",
      priority: "high",
    },
  ],
};

export default function App() {
  return (
    <Bridge
      config={MinimalConfig}
      theme={defaultTheme}
      onAction={(action, target, metadata) => {
        console.log("Action:", action, target, metadata);
      }}
    />
  );
}
```

## Agent Harness

The Bridge shows you the dashboard. The **harness** stands up the agents that feed it.

The harness (`harness/` directory) gives you:

- **Agent definitions** — YAML config describing your agent fleet (who, what tier, what authority)
- **Message bus** — A Postgres table where agents communicate (Supabase or any Postgres)
- **Boot prompt** — Paste into Claude to auto-generate agent instructions and Bridge config
- **Decision authority** — Clear boundaries on what agents can do autonomously vs. what needs human approval
- **Audit trail** — Every inter-agent message is logged

### Quick start (harness)

```bash
# 1. Define your agents
cp harness/examples/startup-ops.yml harness/agents.yml
# Edit to match your world

# 2. Set up the bus
psql -f harness/bus-schema.sql
# Or paste into Supabase SQL Editor

# 3. Boot the system
# Open Claude, paste the contents of harness/BOOT_PROMPT.md
# Claude reads agents.yml, generates everything, wires it up

# 4. Start operating
# Open The Bridge with the generated config
# Start agent sessions with the generated CLAUDE.md files
```

See `harness/README.md` for the full guide and schema reference.

## Configuration

### BridgeConfig Shape

```typescript
interface BridgeConfig {
  // System identity
  name: string;
  subtitle?: string;
  version?: string;

  // Core data
  entities: Entity[];
  objectives: Objective[];
  kanbanColumns: KanbanColumn[];
  backlog: BacklogItem[];
  tasks: Task[];

  // Capability and pattern inventory
  capabilities?: Capability[];
  patterns?: Pattern[];
  integrations?: Integration[];

  // Metrics
  metrics?: Metrics;

  // Life quadrants (optional, for personal systems)
  outcomes?: Outcome[];
  quadrants?: Quadrant[];

  // Operating modes
  modes?: Mode[];

  // UI config
  footer?: FooterConfig;

  // Callbacks
  getStarterPrompt?: () => string;
  onAction?: (action: string, target: any, metadata?: any) => ActionResult;
}

interface Entity {
  id: string;
  name: string;
  tier: string; // "T0" | "T1" | "T2" | "T3" | "T4"
  role: string;
  status: "active" | "staged" | "planned" | "gap" | "concept" | "blocked";
  health?: "G" | "Gr" | "A" | "R";
  icon?: string;
  busMessages?: number;
  connections?: string[]; // array of entity IDs
  dimmed?: boolean; // visual suppression for future agents
  surfaces?: string[]; // multiplexing: PRIMARY, ACCENT, TERTIARY
}

interface Objective {
  id: string;
  name: string;
  description: string;
  progress: number; // 0-100
  health: "G" | "Gr" | "A" | "R";
  quadrant?: string; // "Heart" | "Body" | "Mind" | "Soul" | "Chassis"
  risks?: string[];
  wins?: string[];
}

interface BacklogItem {
  id: string;
  title: string;
  description: string;
  column: string; // kanbanColumns[].id
  priority: "critical" | "high" | "normal" | "low";
  assignee: string; // entities[].id
  due?: string; // ISO date
  kso?: string; // objectives[].id (traceability)
}

interface Task {
  id: string;
  title: string;
  description?: string;
  due?: string;
  priority: "critical" | "high" | "normal" | "low";
  category?: string;
  assignee?: string;
  recurring?: "daily" | "weekly" | "monthly";
}

interface Capability {
  id: string;
  code: string; // "A1", "E2", "G3", etc.
  name: string;
  category: "Agent" | "Environment" | "Governance";
}

interface Pattern {
  id: string;
  name: string;
  description: string;
}

interface Integration {
  id: string;
  name: string;
  icon?: string;
  status: "active" | "staged" | "gap";
}

interface Mode {
  id: string;
  name: string;
  subtitle?: string;
  color?: string;
  crew?: string[]; // array of entity IDs
  tabs?: string[];
  stats?: Record<string, any>;
}
```

## Panel Types

**Entity Hierarchy**
Multi-tier system view with role, status, and health. Sortable by tier, role, or status. Click to open detail drawer. Shows bus message volume and connection topology.

**Objective Progress**
KSO tracking with health status, progress bar, risk/win backlogs. Quadrant allocation (Heart/Body/Mind/Soul). Colour-coded health state.

**Kanban Board**
Drag-drop workflow across custom columns. Items carry priority, assignee, due date, KSO traceability. Real-time filtering by priority or assignee.

**Task Board**
Personal/operational tasks sorted by priority and due date. Recurring task indicators. Mark-done actions with refresh.

**Bus Metrics**
Handoff table health snapshot: total messages, actioned, pending, stale. Average response time. Health state with timestamp.

**Quadrant Balance**
Radar or circular chart showing Heart/Body/Mind/Soul allocation percentages. Useful for life or programme portfolio balancing.

**Pattern Library**
Searchable, categorised reference implementations. Operational patterns, architectural patterns, decision frameworks.

**Integration Status**
External system connectivity: Supabase, Notion, GitHub, Stripe, Gmail, etc. Status per integration (active/staged/gap).

**Capability Matrix**
What capabilities exist (Agent, Environment, Governance). Used for gap analysis and feature planning.

**Mode Tabs**
Dynamic tabs based on selected mode (BUILD or OPS). BUILD shows backlog/waves/skills; OPS shows inbox/metrics/risks.

**Detail Drawers**
Entity drill-down: connections, bus message detail, contact info, permissions. Objective deep-dive: risks, wins, related backlog, KSO cascade.

## Theming

THE BRIDGE uses a minimal, configurable theme system.

```typescript
interface Theme {
  colors: {
    bg: string;
    text: string;
    border: string;
    health: Record<string, string>;
    priority: Record<string, string>;
    status: Record<string, string>;
  };
  spacing: Record<string, string>;
  fonts: Record<string, string>;
}
```

**Use Cases**

```jsx
import { defaultTheme, lightTheme, createTheme } from "@bridge/theme";

// Built-in themes
<Bridge config={config} theme={defaultTheme} />
<Bridge config={config} theme={lightTheme} />

// Custom theme
const customTheme = createTheme({
  primary: "#3B82F6",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
});

<Bridge config={config} theme={customTheme} />
```

## Examples

See `/examples/demo-config.js` for a complete working configuration — a platform engineering team managing 18 microservices across 4 tiers, tracking reliability, velocity, security, and cost objectives.

The demo config shows:

- 18 services across 4 tiers (Core Platform → Business → Support → Infrastructure + Guardians)
- 5 objectives with risk/win backlogs
- 15 backlog items across a 7-column kanban
- 8 operational tasks with priority, category, and assignment
- 17 capabilities (Reliability, Delivery, Security, Observability)
- 12 architectural patterns
- 10 external integrations
- Dual modes (BUILD for shipping, OPS for operations) with crew assignments
- Quadrant balance (Platform / Delivery / Trust)

Use this as a starting point for your own domain.

## Use Cases

THE BRIDGE is domain-agnostic. The config schema maps to any system with entities, objectives, and workflow:

- **Platform engineering** — services, SLOs, incidents, deployments
- **AI/ML operations** — models, pipelines, experiments, drift detection
- **Programme delivery** — workstreams, milestones, risks, dependencies
- **Multi-agent systems** — agents, health states, message flow, governance
- **Product portfolios** — products, OKRs, feature pipeline, integrations

## License

MIT
