# The Bridge — Agent Harness Boot Prompt

> **What this is:** Copy this entire file and paste it into a new Claude session
> (Claude Code, Cowork, or Chat). Claude will read your `agents.yml`, set up the
> message bus, generate agent instructions, and wire everything into a Bridge
> config. By the end, you'll have a running agent fleet with a control room.

---

## Boot Prompt — paste everything below this line into Claude

You are bootstrapping an agent operating system using The Bridge harness.

### Your mission

Read the agent definition file (`harness/agents.yml` in this repo) and execute
the following steps in order. Do not skip steps. Report progress after each one.

### Step 1 — Parse the agent definitions

Read `harness/agents.yml`. Extract:
- System identity (name, subtitle, bus project ID)
- All objectives (id, name, description, quadrant)
- All agents (id, name, tier, role, status, tools, objectives, connections, authority, bus_address, instructions)

Report: "Found N agents across M tiers, serving P objectives."

### Step 2 — Set up the message bus

If the user has a Supabase project connected:
1. Read `harness/bus-schema.sql`
2. Execute it against the Supabase project using `execute_sql`
3. Verify the `handoff` table exists
4. Verify the `bus_pending` and `bus_health` views exist

If no Supabase project is connected:
1. Tell the user they need a Postgres database for the bus
2. Point them to `harness/bus-schema.sql` to run manually
3. Continue with remaining steps (agents can be set up without the bus running)

Report: "Bus schema deployed" or "Bus schema ready for manual deployment."

### Step 3 — Generate agent instruction files

For each agent in `agents.yml`:
1. Read the template at `harness/templates/CLAUDE.md.template`
2. Fill in the template variables:
   - `{{AGENT_NAME}}` → agent.name
   - `{{BUS_ADDRESS}}` → agent.bus_address
   - `{{TIER}}` → agent.tier
   - `{{ROLE}}` → agent.role
   - `{{STATUS}}` → agent.status
   - `{{INSTRUCTIONS}}` → agent.instructions
   - `{{AUTONOMOUS_LIST}}` → bullet list from agent.authority.autonomous
   - `{{APPROVAL_LIST}}` → bullet list from agent.authority.requires_approval
   - `{{CONNECTIONS}}` → comma-separated list of agent.connections
   - `{{OBJECTIVES}}` → comma-separated list of agent.objectives
3. Write the filled template to `harness/generated/{agent.id}/CLAUDE.md`

Report: "Generated instruction files for N agents."

### Step 4 — Generate the Bridge config

Create a JavaScript config file at `harness/generated/bridge-config.js` that:
1. Maps each agent to a Bridge `Entity` object:
   ```js
   {
     id: agent.id,
     name: agent.name,
     tier: agent.tier,
     role: agent.role,
     status: agent.status,
     health: "G",  // Default — will be updated by bus data
     icon: agent.icon,
     connections: agent.connections,
     dimmed: agent.status !== "active",
   }
   ```
2. Maps each objective to a Bridge `Objective` object
3. Creates sensible default modes (BUILD + OPS) with:
   - Crew members derived from T0-T1 agents
   - Tabs mapped to available data
   - Stats showing agent count, bus health, objective progress
4. Wires up the `getStarterPrompt` function to generate context-aware prompts
   that include the agent's bus_address and instructions
5. Exports the config as default

Report: "Bridge config generated with N entities and M objectives."

### Step 5 — Write the system CLAUDE.md

Create a root-level `CLAUDE.md` (or append to existing) that gives any Claude
session awareness of the agent fleet:

```markdown
# [System Name] — Agent Operating System

## Bus
- Table: `handoff` in Supabase project `[project_id]`
- Poll with: `SELECT * FROM bus_pending`
- Health check: `SELECT * FROM bus_health`

## Agents
[Table of all agents with id, bus_address, tier, role, status]

## Decision Authority
- Autonomous decisions: agents can act within their authority boundaries
- Human approval: anything marked "requires_approval" in agent definitions
- Strategic decisions: always human

## Session Protocol
1. On start: poll bus, report pending items
2. On end: write HANDOFF message, flag unresolved items
```

Report: "System CLAUDE.md written."

### Step 6 — Seed the bus

Write an initial message to the handoff table:

```sql
INSERT INTO handoff (from_agent, to_agent, topic, body, metadata, status)
VALUES (
  'system.boot',
  '[orchestrator_bus_address]',
  'system-bootstrap',
  'Agent harness bootstrapped. N agents registered. Bus active. Awaiting first instructions.',
  '{"message_type": "OBS", "priority": "normal", "source_entity": "system.boot"}'::jsonb,
  'pending'
);
```

Report: "Bus seeded with bootstrap message."

### Step 7 — Summary and next steps

Print a summary table:

| Agent | Tier | Status | Bus Address | Instructions |
|-------|------|--------|-------------|--------------|
| ...   | ...  | ...    | ...         | Generated ✓  |

Then tell the user:

**Your agent fleet is ready.** Here's what to do next:

1. **Open The Bridge** — Run `npm run dev` in `examples/dev-server/` and load
   the generated config (`harness/generated/bridge-config.js`)
2. **Start the orchestrator** — Open a new Claude session, paste the contents of
   `harness/generated/orchestrator/CLAUDE.md`, and say "poll the bus"
3. **Add more agents** — Edit `harness/agents.yml` and re-run this boot prompt
4. **Customise** — Edit the generated CLAUDE.md files to add domain-specific
   instructions, tools, and authority boundaries

**The harness gives you:**
- A visual control room (The Bridge)
- A message bus (Supabase handoff table)
- Agent instruction files (CLAUDE.md per agent)
- Decision authority boundaries
- Session start/end protocols
- Audit trail via the bus

**You bring:**
- Your domain knowledge (what agents should do)
- Your tools (which MCPs to connect)
- Your objectives (what success looks like)
- Your authority model (who can decide what)
