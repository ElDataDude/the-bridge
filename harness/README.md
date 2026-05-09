# The Bridge — Agent Harness

The harness is the operational backbone that turns The Bridge from a static dashboard into a living agent operating system. Define your agents in YAML, paste the boot prompt into Claude, and get a running fleet with a control room.

## What's in here

```
harness/
├── README.md              ← You are here
├── BOOT_PROMPT.md         ← THE KEY FILE. Paste into Claude to stand everything up.
├── agents.yml             ← Define your agents here. Edit this.
├── bus-schema.sql         ← SQL for the message bus (run against Postgres/Supabase)
├── templates/
│   ├── CLAUDE.md.template ← Template for per-agent instructions
│   └── skill.md.template  ← Template for skill definitions
├── examples/
│   ├── startup-ops.yml    ← Example: 4-agent startup team
│   ├── consulting-practice.yml ← Example: solo consultant with agent fleet
│   └── managed-fleet.yml  ← Example: mixed Claude Code + Managed Agents fleet
└── generated/             ← Created by boot prompt (gitignored)
    ├── bridge-config.js
    ├── managed-agents.json
    ├── orchestrator/CLAUDE.md
    ├── builder/CLAUDE.md
    └── ...
```

## How it works

**The Bridge** is the view layer — a configurable dashboard that shows you entities, objectives, backlog, and health at a glance.

**The harness** is the operating layer — the infrastructure that lets agents coordinate via a message bus, follow instruction files, and report status back to the dashboard.

Together, they give you:

1. **Agent definitions** (agents.yml) — who exists, what they do, what they're allowed to decide
2. **A message bus** (Supabase handoff table) — how agents communicate and hand off work
3. **Instruction files** (CLAUDE.md per agent) — what Claude does when acting as each agent
4. **A control room** (Bridge dashboard) — visual status of the whole fleet
5. **Decision authority** — clear boundaries on what's autonomous vs. needs human approval
6. **Audit trail** — every message on the bus is a record of what happened

## Anthropic Managed Agents

By default, the harness preserves the existing Claude Code/manual workflow:
every agent gets a generated `harness/generated/{agent.id}/CLAUDE.md` file and
can be started by pasting that file into a Claude session.

Anthropic Managed Agents are an additive runtime option for agents that should
be enrolled and run through `bridge-dispatcher`. Add `runtime: managed`,
`model`, and the managed-agent metadata to the relevant agent. The boot prompt
will still generate the normal CLAUDE.md files, and will additionally write
`harness/generated/managed-agents.json` for dispatcher/bootstrap handoff.

```yaml
agents:
  - id: nightly-analyst
    name: Nightly Analyst
    tier: T2
    role: "Runs scheduled analysis and posts outcomes to the bus"
    status: staged
    runtime: managed
    model: "claude-sonnet-4-5"
    bus_address: "managed.analytics.nightly"
    managed:
      team_id: "team-growth"
      use_case_id: "daily-analysis"
      cadence_minutes: 1440
    memory:
      shared: ["mem_growth_shared"]
      private: ["mem_nightly_analyst"]
    outcome:
      rubric_file: "harness/rubrics/daily-analysis.md"
      max_iterations: 2
    multiagent:
      type: "review"
      agents: ["nightly-analyst", "outcome-reviewer"]
```

Dispatcher runbook pointer: after running `BOOT_PROMPT.md`, hand
`harness/generated/managed-agents.json` to the internal bridge-dispatcher flow
documented in `/Users/bryanj/dev/bridge-dispatcher/docs/ARCHITECTURE.md`.
Manual fallback remains the generated `harness/generated/{agent.id}/CLAUDE.md`
files; use them when Managed Agents credentials, environment provisioning, or
dispatcher bootstrap are unavailable.

## Quick start

### 1. Define your agents

Edit `agents.yml` (or copy one of the examples):

```yaml
agents:
  - id: my-agent
    name: My Agent
    tier: T1
    role: "Does the thing"
    status: active
    bus_address: "cowork.myproject.my-agent"
    tools: [supabase, github]
    objectives: [ship-faster]
    connections: [other-agent]
    authority:
      autonomous:
        - "Do routine things"
      requires_approval:
        - "Do risky things"
    instructions: |
      You are my agent. You do the thing. Be good at it.
```

### 2. Set up the bus

Run `bus-schema.sql` against your Postgres database:

```bash
psql -f harness/bus-schema.sql
# or paste into Supabase SQL Editor
```

### 3. Boot the system

Open a Claude session (Code, Cowork, or Chat) and paste the contents of `BOOT_PROMPT.md`. Claude will:

- Parse your agent definitions
- Deploy the bus schema (if Supabase is connected)
- Generate per-agent CLAUDE.md files
- Generate `managed-agents.json` when `runtime: managed` agents exist
- Create a Bridge config wired to your agents
- Seed the bus with a bootstrap message

### 4. Start operating

- Open The Bridge dashboard with the generated config
- Start agent sessions by pasting their CLAUDE.md into Claude
- Agents communicate via the bus — poll, dispatch, track, audit

## Agent definition schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | yes | Unique kebab-case identifier |
| `name` | string | yes | Display name |
| `tier` | string | yes | T0 (strategic) through T4 (guardian) |
| `role` | string | yes | One-line description of function |
| `status` | string | yes | active, staged, planned, concept, gap |
| `icon` | string | no | Emoji or icon identifier |
| `bus_address` | string | yes | Entity ID for bus routing |
| `runtime` | string | no | Runtime adapter. Omit for Claude Code/manual behavior; use `managed` for Anthropic Managed Agents via bridge-dispatcher |
| `model` | string | no | Anthropic model for `runtime: managed` agents |
| `managed.team_id` | string | no | Dispatcher tenant boundary for a managed agent |
| `managed.use_case_id` | string | no | Dispatcher workload boundary within a team |
| `managed.cadence_minutes` | number | no | Optional managed-agent cadence for scheduled work |
| `memory.shared` | list | no | Shared memory store ids made available to the agent |
| `memory.private` | list | no | Private memory store ids for this agent only |
| `outcome.rubric_file` | string | no | Local rubric file used by outcome review |
| `outcome.max_iterations` | number | no | Maximum outcome revision attempts |
| `multiagent.type` | string | no | Optional Managed Agents multiagent mode |
| `multiagent.agents` | list | no | Local harness agent ids resolved by bootstrap to managed agent/version placeholders |
| `tools` | list | no | MCP tools / integrations needed |
| `objectives` | list | no | Objective IDs this agent serves |
| `connections` | list | no | Agent IDs this agent communicates with |
| `authority.autonomous` | list | no | Decisions agent can make alone |
| `authority.requires_approval` | list | no | Decisions needing human sign-off |
| `instructions` | string | yes | Operating instructions for Claude |

## Bus schema

The message bus is a single Postgres table (`handoff`) with:

- **Routing**: from_agent, to_agent, topic
- **Content**: body (self-contained message)
- **Metadata**: JSONB with message_type, priority, stakeholders, refs
- **Lifecycle**: pending → acknowledged → in_progress → resolved (also: blocked, superseded)
- **Timestamps**: created_at, acknowledged_at

See `bus-schema.sql` for the full DDL including indexes and helper views.

## Decision authority model

Every agent has two lists:

- **Autonomous**: things the agent can do without asking. It logs them to the bus but doesn't wait for approval. "Crack on and log it."
- **Requires approval**: things the agent must escalate to a human. It writes a proposal to the bus and waits. "Flag and wait."

Anything not in either list defaults to "requires approval". When in doubt, escalate.

## Tiers

| Tier | Name | Purpose |
|------|------|---------|
| T0 | Strategic | System-wide coordination, the orchestrator |
| T1 | Domain Lead | Owns a functional area (engineering, support, content) |
| T2 | Operator | Handles specific operational tasks |
| T3 | Specialist | Deep expertise in a narrow domain |
| T4 | Guardian | Watches for problems, audits compliance, independent |

Guardians (T4) are special: they answer only to the human operator and cannot be overridden by other agents. Use them for governance, quality, and security.

## Examples

- `examples/startup-ops.yml` — 4 agents for a startup CTO (PM, Eng Lead, Support, Infra Monitor)
- `examples/consulting-practice.yml` — 4 agents for a solo consultant (Chief of Staff, Prospector, Content Engine, Admin)
- `examples/managed-fleet.yml` — mixed manual and Anthropic Managed Agents metadata

Copy one, rename to `agents.yml`, edit to match your world.
